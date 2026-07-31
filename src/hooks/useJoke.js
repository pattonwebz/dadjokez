import { useCallback, useEffect, useState } from 'react';

const APIBase = 'https://icanhazdadjoke.com';

// The API identifies callers by User-Agent, but browsers forbid setting that
// header from fetch(), so there is no point sending one. Accept is what makes
// it return JSON instead of a plain text joke.
const fetchFromAPI = async (path, signal) => {
    const response = await fetch(`${APIBase}${path}`, {
        headers: { 'Accept': 'application/json' },
        signal
    });

    if (!response.ok) {
        throw new Error(`icanhazdadjoke responded with ${response.status}`);
    }

    return response.json();
};

/**
 * Fetches a joke from the given API path.
 *
 * `selectJoke` turns the API payload into a `{ id, joke }` object and must be
 * declared outside of a component so it stays stable between renders.
 */
const useJoke = (path, selectJoke) => {
    const [state, setState] = useState({ status: 'loading', joke: null });
    const [attempt, setAttempt] = useState(0);

    const retry = useCallback(() => setAttempt((count) => count + 1), []);

    useEffect(() => {
        const controller = new AbortController();

        setState({ status: 'loading', joke: null });

        fetchFromAPI(path, controller.signal)
            .then((data) => setState({ status: 'ready', joke: selectJoke(data) }))
            .catch((err) => {
                if (err.name === 'AbortError') {
                    return;
                }
                console.error('Error: ', err);
                setState({ status: 'error', joke: null });
            });

        return () => controller.abort();
    }, [path, selectJoke, attempt]);

    return { ...state, retry };
};

export default useJoke;
