import useJoke from '../hooks/useJoke';
import JokeCard from './JokeCard';

const selectJoke = (data) => ({ id: data.id, joke: data.joke });

const DadJoke = ({ joke }) => {
    const state = useJoke(joke ? `/j/${joke}` : '/', selectJoke);

    return <JokeCard {...state} />;
}

export default DadJoke;
