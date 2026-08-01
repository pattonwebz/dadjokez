import { useEffect, useRef, useSyncExternalStore } from 'react';

import { getShortcutsEnabled, subscribe } from '../shortcuts';

const isTypingTarget = (target) =>
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/**
 * Binds single key shortcuts, e.g. { n: showNext, f: save }.
 *
 * Ignores anything with a modifier held, so browser and operating system
 * shortcuts are left alone, and does nothing while the reader has turned
 * shortcuts off.
 */
const useHotkeys = (bindings) => {
    const enabled = useSyncExternalStore(subscribe, getShortcutsEnabled, getShortcutsEnabled);

    // Kept in a ref so the listener is attached once rather than on every
    // render, without the caller having to memoise the handlers.
    const latest = useRef(bindings);
    latest.current = bindings;

    useEffect(() => {
        if (!enabled) {
            return undefined;
        }

        const onKeyDown = (event) => {
            if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) {
                return;
            }

            if (isTypingTarget(event.target)) {
                return;
            }

            const handler = latest.current[event.key.toLowerCase()];

            if (handler) {
                event.preventDefault();
                handler();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [enabled]);

    return enabled;
};

export default useHotkeys;
