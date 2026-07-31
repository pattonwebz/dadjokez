import { useParams } from 'react-router';

import DadJoke from '../components/DadJoke';

const JokePage = () => {
    const { jokeID } = useParams();

    return (
        <section className="inner-container">
            <DadJoke joke={jokeID} />
        </section>
    );
}

export default JokePage;
