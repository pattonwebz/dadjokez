import useJoke from '../hooks/useJoke';
import JokeCard from './JokeCard';

const selectJoke = (data) => ({ id: data.id, joke: data.joke });

/**
 * One specific joke, by id. Permalinks go through here rather than the buffer,
 * since the whole point of the URL is that it resolves to that joke, so the
 * way on to a fresh one is a link home rather than a swap in place.
 */
const DadJoke = ({ joke }) => {
    const state = useJoke(`/j/${joke}`, selectJoke);

    return <JokeCard {...state} nextTo="/" />;
}

export default DadJoke;
