import { useEffect, useRef } from 'react';
import { Link } from 'react-router';

import '../joke.css';

const JokeCard = ({ status, joke, retry, onNext }) => {
    const statusRef = useRef(null);
    const hasRetried = useRef(false);

    const handleRetry = () => {
        hasRetried.current = true;
        retry();
    };

    // The retry button unmounts as soon as it is pressed, which would drop
    // keyboard focus back to the top of the document. Move it onto the result
    // instead, once the request has settled. The "tell me another" button does
    // not need this: it stays mounted, so focus never leaves it.
    useEffect(() => {
        if (status !== 'loading' && hasRetried.current) {
            hasRetried.current = false;
            statusRef.current?.focus();
        }
    }, [status]);

    return (
        <div className="joke" aria-busy={status === 'loading'}>
            {/*
                One container that outlives every state change, so a screen
                reader announces the joke arriving. Swapping the whole element
                per state would leave nothing to announce against, and the
                content of a live region is not read out when it first appears.
            */}
            <div className="joke__status" role="status" tabIndex={-1} ref={statusRef}>
                {status === 'loading' && <p>Loading a joke...</p>}
                {status === 'error' && <p>The joke machine is having a bad day.</p>}
                {status === 'ready' && <p>{joke.joke}</p>}
            </div>

            {status === 'error' && (
                <button className="retry" type="button" onClick={handleRetry}>
                    Try again
                </button>
            )}

            {status === 'ready' && onNext && (
                <button className="next" type="button" onClick={onNext}>
                    Tell me another
                </button>
            )}

            {status === 'ready' && (
                <small className="permalink">
                    <Link to={`/joke/${joke.id}`} aria-label="Permalink to this joke">
                        Permalink
                    </Link>
                </small>
            )}
        </div>
    );
}

export default JokeCard;
