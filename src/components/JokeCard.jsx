import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { isFavorite, toggleFavorite } from '../favorites';
import { setShortcutsEnabled } from '../shortcuts';
import useFavorites from '../hooks/useFavorites';
import useHotkeys from '../hooks/useHotkeys';

import '../joke.css';

/**
 * `onNext` swaps the joke in place. `nextTo` is for pages that have no buffer
 * of their own, such as a permalink, where the way to a fresh joke is a link
 * somewhere else.
 */
const JokeCard = ({ status, joke, retry, onNext, nextTo }) => {
    const navigate = useNavigate();
    const statusRef = useRef(null);
    const hasRetried = useRef(false);
    const [note, setNote] = useState('');

    // Subscribing keeps the button in step when the same joke is saved or
    // dropped from somewhere else, such as the favourites page in another tab.
    useFavorites();
    const saved = joke ? isFavorite(joke.id) : false;

    // Says what just happened, for anyone who triggered it from the keyboard
    // and so has no button label to read the result from. It stays until
    // something else happens rather than timing out.
    const showNote = useCallback((text) => setNote(text), []);

    const handleRetry = () => {
        hasRetried.current = true;
        retry();
    };

    const handleSave = () => {
        if (!joke) {
            return;
        }
        showNote(toggleFavorite(joke) ? 'Saved to favorites' : 'Removed from favorites');
    };

    const handleCopy = async () => {
        if (!joke) {
            return;
        }

        const url = `${window.location.origin}/joke/${joke.id}`;

        // Needs a secure context, so it is absent over plain http.
        if (!navigator.clipboard) {
            showNote('Copying needs a secure connection. Use the permalink instead.');
            return;
        }

        try {
            await navigator.clipboard.writeText(url);
            showNote('Permalink copied');
        } catch {
            showNote('Could not copy. Use the permalink instead.');
        }
    };

    // The retry button unmounts as soon as it is pressed, which would drop
    // keyboard focus back to the top of the document. Move it onto the result
    // instead, once the request has settled. The other buttons stay mounted,
    // so focus never leaves them.
    useEffect(() => {
        if (status !== 'loading' && hasRetried.current) {
            hasRetried.current = false;
            statusRef.current?.focus();
        }
    }, [status]);

    // Showing a different joke is itself an action, so it clears the note.
    useEffect(() => {
        setNote('');
    }, [joke?.id]);

    const bindings = {};
    if (onNext) {
        bindings.n = onNext;
    } else if (nextTo) {
        bindings.n = () => navigate(nextTo);
    }
    if (status === 'ready') {
        bindings.f = handleSave;
        bindings.c = handleCopy;
    }
    const shortcutsOn = useHotkeys(bindings);
    const canGoNext = Boolean(onNext || nextTo);

    return (
        <>
            <div className="joke" aria-busy={status === 'loading'}>
                {/*
                    One container that outlives every state change, so a screen
                    reader announces the joke arriving. Swapping the whole
                    element per state would leave nothing to announce against,
                    and the content of a live region is not read out when it
                    first appears.
                */}
                <div className="joke__status" role="status" tabIndex={-1} ref={statusRef}>
                    {status === 'loading' && <p>Loading a joke...</p>}
                    {status === 'error' && <p>The joke machine is having a bad day.</p>}
                    {status === 'ready' && <p>{joke.joke}</p>}
                </div>

                {status === 'error' && (
                    <div className="joke__actions">
                        <button className="retry" type="button" onClick={handleRetry}>
                            Try again
                        </button>
                    </div>
                )}

                {status === 'ready' && (
                    <div className="joke__actions">
                        {onNext && (
                            <button className="next" type="button" onClick={onNext}>
                                Tell me another
                            </button>
                        )}
                        {!onNext && nextTo && (
                            <Link className="next" to={nextTo}>
                                Tell me another
                            </Link>
                        )}
                        <button
                            className="save"
                            type="button"
                            onClick={handleSave}
                            aria-pressed={saved}
                        >
                            {saved ? 'Saved' : 'Save'}
                        </button>
                    </div>
                )}

                {/* Kept in the tree at a fixed height whether or not it has
                    anything to say, so announcements work and nothing shifts. */}
                <p className="joke__note" role="status">{note}</p>

                {status === 'ready' && (
                    <small className="permalink">
                        <Link to={`/joke/${joke.id}`} aria-label="Permalink to this joke">
                            Permalink
                        </Link>
                    </small>
                )}
            </div>

            {status === 'ready' && (
                <p className="shortcut-hint">
                    {shortcutsOn ? (
                        <>
                            Press{' '}
                            {canGoNext && (
                                <>
                                    <kbd>N</kbd> for another,{' '}
                                </>
                            )}
                            <kbd>F</kbd> to save, <kbd>C</kbd> to copy the link.{' '}
                            <button
                                className="link-button"
                                type="button"
                                onClick={() => setShortcutsEnabled(false)}
                            >
                                Turn shortcuts off
                            </button>
                        </>
                    ) : (
                        <>
                            Keyboard shortcuts are off.{' '}
                            <button
                                className="link-button"
                                type="button"
                                onClick={() => setShortcutsEnabled(true)}
                            >
                                Turn them on
                            </button>
                        </>
                    )}
                </p>
            )}
        </>
    );
}

export default JokeCard;
