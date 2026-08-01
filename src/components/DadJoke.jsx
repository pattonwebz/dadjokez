import useJoke from '../hooks/useJoke';
import usePageTitle from '../hooks/usePageTitle';
import JokeCard from './JokeCard';

const selectJoke = (data) => ({ id: data.id, joke: data.joke });

/**
 * One specific joke, by id. Permalinks go through here rather than the buffer,
 * since the whole point of the URL is that it resolves to that joke, so the
 * way on to a fresh one is a link home rather than a swap in place.
 */
const DadJoke = ({ joke }) => {
    const state = useJoke(`/j/${joke}`, selectJoke);

    // The prerendered page already carries the joke as its title, for the sake
    // of link previews. Setting anything else here would replace it with
    // something vaguer the moment the bundle runs.
    usePageTitle(state.joke ? state.joke.joke : 'A Joke');

    return <JokeCard {...state} nextTo="/" />;
}

export default DadJoke;
