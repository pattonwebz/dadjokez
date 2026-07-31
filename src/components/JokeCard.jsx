import { Link } from 'react-router';

import '../joke.css';

const JokeCard = ({ status, joke, retry }) => {
    if (status === 'loading') {
        return (
            <div className="joke" aria-busy="true">
                <p>Loading...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="joke joke--error">
                <p>The joke machine is having a bad day.</p>
                <button className="retry" type="button" onClick={retry}>
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="joke">
            <p>{joke.joke}</p>
            <small className="permalink">
                <Link to={`/joke/${joke.id}`}>Permalink</Link>
            </small>
        </div>
    );
}

export default JokeCard;
