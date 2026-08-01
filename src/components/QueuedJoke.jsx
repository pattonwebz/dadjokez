import useJokeQueue from '../hooks/useJokeQueue';
import JokeCard from './JokeCard';

const QueuedJoke = ({ source }) => {
    const { status, joke, next } = useJokeQueue(source);

    return <JokeCard status={status} joke={joke} retry={next} onNext={next} />;
}

export default QueuedJoke;
