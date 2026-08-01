/*
    Whether the single key shortcuts are live.

    Single character shortcuts collide with the quick navigation keys screen
    readers bind in browse mode, so WCAG asks that they can be switched off.
    That preference lives here and is remembered.
*/

const STORAGE_KEY = 'dadjokez.shortcuts.v1';

const listeners = new Set();

const read = () => {
    try {
        return localStorage.getItem(STORAGE_KEY) !== 'off';
    } catch {
        return true;
    }
};

let enabled = read();

export const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const getShortcutsEnabled = () => enabled;

export const setShortcutsEnabled = (next) => {
    enabled = next;
    try {
        localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
    } catch {
        // Preference just will not persist.
    }
    for (const listener of listeners) {
        listener();
    }
};
