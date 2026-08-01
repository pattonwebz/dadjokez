/*
    Saved jokes, in localStorage so they outlive the tab. The joke text is
    stored alongside the id, so the favourites list renders without going back
    to the API for jokes the reader has already seen.
*/

const STORAGE_KEY = 'dadjokez.favorites.v1';

const listeners = new Set();

const read = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(saved)
            ? saved.filter((j) => j && typeof j.id === 'string' && typeof j.joke === 'string')
            : [];
    } catch {
        return [];
    }
};

// Held as one array that is replaced rather than mutated, so the reference
// only changes when the contents do. useSyncExternalStore relies on that.
let items = read();

const announce = () => {
    for (const listener of listeners) {
        listener();
    }
};

const write = (next) => {
    items = next;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        // Private browsing or a full quota. Favourites stay for this tab only.
    }
    announce();
};

// Another tab changing the list should be reflected here too.
if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
            items = read();
            announce();
        }
    });
}

export const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const getFavorites = () => items;

export const isFavorite = (id) => items.some((j) => j.id === id);

/** Adds the joke, or drops it if it is already saved. Returns true if saved. */
export const toggleFavorite = (joke) => {
    if (!joke?.id) {
        return false;
    }

    if (isFavorite(joke.id)) {
        write(items.filter((j) => j.id !== joke.id));
        return false;
    }

    // Newest first, so the list reads as a history of what was saved.
    write([{ id: joke.id, joke: joke.joke }, ...items]);
    return true;
};

export const removeFavorite = (id) => {
    write(items.filter((j) => j.id !== id));
};
