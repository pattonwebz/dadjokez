import { useSyncExternalStore } from 'react';

import { getFavorites, subscribe } from '../favorites';

/** The saved jokes, kept in step across every component that shows them. */
const useFavorites = () => useSyncExternalStore(subscribe, getFavorites, getFavorites);

export default useFavorites;
