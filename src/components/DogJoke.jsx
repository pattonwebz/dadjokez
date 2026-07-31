import useJoke from '../hooks/useJoke';
import JokeCard from './JokeCard';

// 30 is the largest page the search endpoint will return.
const searchPath = '/search?term=dog&limit=30';

const selectJoke = (data) => {
    if (!data.results || !data.results.length) {
        throw new Error('No dog jokes came back from the search');
    }

    const randomID = Math.floor(Math.random() * data.results.length);

    return {
        id: data.results[randomID].id,
        joke: data.results[randomID].joke
    };
};

const DogJoke = () => {
    const state = useJoke(searchPath, selectJoke);

    return <JokeCard {...state} />;
}

export default DogJoke;
