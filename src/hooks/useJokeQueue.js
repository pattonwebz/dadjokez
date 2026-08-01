import { useCallback, useEffect, useRef, useState } from 'react';

import { fill, take, topUp } from '../jokeQueue';

/**
 * Shows a joke from the buffer.
 *
 * `next` is what the button calls. When the buffer has something in it, which
 * is the usual case, it swaps the joke synchronously with no loading state and
 * no request.
 */
const useJokeQueue = (source) => {
    const [state, setState] = useState({ status: 'loading', joke: null });
    const startedFor = useRef(null);

    const next = useCallback(async () => {
        const buffered = take(source);

        if (buffered) {
            setState({ status: 'ready', joke: buffered });
            topUp(source);
            return;
        }

        // Only reached on a cold start, or if a previous top up failed.
        setState({ status: 'loading', joke: null });

        try {
            await fill(source);
            const joke = take(source);

            if (!joke) {
                throw new Error('The queue was still empty after filling');
            }

            setState({ status: 'ready', joke });
            topUp(source);
        } catch (err) {
            console.error('Error: ', err);
            setState({ status: 'error', joke: null });
        }
    }, [source]);

    // Guarded so React's development double-invoke does not pull two jokes off
    // the buffer on mount.
    useEffect(() => {
        if (startedFor.current === source) {
            return;
        }
        startedFor.current = source;
        next();
    }, [source, next]);

    return { ...state, next, retry: next };
};

export default useJokeQueue;
