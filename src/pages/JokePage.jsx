import { useParams } from 'react-router';

import DadJoke from '../components/DadJoke';
import usePageTitle from '../hooks/usePageTitle';

const JokePage = () => {
    const { jokeID } = useParams();

    usePageTitle('A Joke');

    return (
        <section className="inner-container">
            <h2 className="visually-hidden">A single dad joke</h2>
            <DadJoke joke={jokeID} />
        </section>
    );
}

export default JokePage;
