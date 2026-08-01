import { useParams } from 'react-router';

import DadJoke from '../components/DadJoke';

// The title is set by DadJoke, which is the thing that knows the joke.
const JokePage = () => {
    const { jokeID } = useParams();

    return (
        <section className="inner-container">
            <h2 className="visually-hidden">A single dad joke</h2>
            <DadJoke joke={jokeID} />
        </section>
    );
}

export default JokePage;
