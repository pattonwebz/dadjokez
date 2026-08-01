/*
    A buffer of jokes held outside React, so showing the next one is a
    synchronous shift off an array rather than a request.

    The API's search endpoint is paginated over every joke it has and caps
    `limit` at 30, so one request fills the buffer 30 deep. Topping up while
    ten are still in hand leaves plenty of runway for the request to land
    before anyone can click through the remainder, and settles at roughly one
    request per thirty jokes read.

    The buffer is mirrored into sessionStorage, so a reload or a return visit
    in the same tab starts with jokes already in hand.
*/

const APIBase = 'https://icanhazdadjoke.com';
const STORAGE_KEY = 'dadjokez.queue.v1';
const PAGE_SIZE = 30;
// Enough left that a top up can complete unnoticed even while someone is
// clicking through jokes as fast as they can read them.
const REFILL_AT = 10;

// Corrected from total_pages on the first response. Only a starting guess so
// the very first request is not always page 1, which would hand every new
// visitor the same opening jokes.
const ASSUMED_PAGES = 25;

const sources = {
    random: { term: '', paged: true },
    dog: { term: 'dog', paged: false }
};

const state = {
    random: { jokes: [], totalPages: ASSUMED_PAGES },
    dog: { jokes: [], totalPages: 1 }
};

const inFlight = {};

const shuffle = (items) => {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
};

const persist = () => {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Private browsing or a full quota. The buffer still works in memory.
    }
};

const restore = () => {
    try {
        const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
        if (!saved) {
            return;
        }
        for (const key of Object.keys(state)) {
            const jokes = saved[key]?.jokes;
            if (Array.isArray(jokes)) {
                state[key].jokes = jokes.filter((j) => j && j.id && j.joke);
            }
            if (saved[key]?.totalPages > 0) {
                state[key].totalPages = saved[key].totalPages;
            }
        }
    } catch {
        // Malformed storage from an older build. Start empty.
    }
};

restore();

const requestPage = async (source, page) => {
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), page: String(page) });
    if (sources[source].term) {
        params.set('term', sources[source].term);
    }

    const response = await fetch(`${APIBase}/search?${params}`, {
        headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
        throw new Error(`icanhazdadjoke responded with ${response.status}`);
    }

    const data = await response.json();

    // The API reports some failures as HTTP 200 with the real status in the body.
    if (data.status >= 400) {
        throw new Error(data.message || `icanhazdadjoke returned ${data.status}`);
    }

    return data;
};

/**
 * Fetches a page and appends whatever is not already queued. Concurrent calls
 * share one request.
 */
export const fill = (source) => {
    if (inFlight[source]) {
        return inFlight[source];
    }

    const entry = state[source];

    const run = (async () => {
        const page = sources[source].paged
            ? 1 + Math.floor(Math.random() * Math.max(1, entry.totalPages))
            : 1;

        let data = await requestPage(source, page);

        // If the joke count ever shrinks, a remembered page number can land
        // past the end. Page 1 always exists.
        if (!data.results?.length && page !== 1) {
            data = await requestPage(source, 1);
        }

        if (data.total_pages > 0) {
            entry.totalPages = data.total_pages;
        }

        const queued = new Set(entry.jokes.map((j) => j.id));
        const incoming = shuffle(data.results || [])
            .map((r) => ({ id: r.id, joke: r.joke }))
            .filter((j) => !queued.has(j.id));

        entry.jokes.push(...incoming);

        if (!entry.jokes.length) {
            throw new Error('No jokes came back');
        }

        persist();
    })();

    inFlight[source] = run;

    return run.finally(() => {
        delete inFlight[source];
    });
};

/** Takes the next joke, or null when the buffer is empty. Never fetches. */
export const take = (source) => {
    const joke = state[source].jokes.shift() || null;
    if (joke) {
        persist();
    }
    return joke;
};

/**
 * Refills in the background once the buffer runs low. Never awaited, so it
 * cannot delay what is on screen. Safe to call after every take: concurrent
 * calls share the one in-flight request.
 */
export const topUp = (source) => {
    if (state[source].jokes.length > REFILL_AT) {
        return;
    }
    // Failure here is not worth surfacing: whatever is on screen still stands,
    // and the next take() that finds an empty buffer will report it.
    fill(source).catch(() => {});
};

/** Buffer depth, for tests and debugging. */
export const remaining = (source) => state[source].jokes.length;
