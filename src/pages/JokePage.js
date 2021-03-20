import { useParams } from "react-router-dom";

import DadJoke from '../components/DadJoke'

const JokePage = () => {

    const {jokeID} = useParams();
    console.log(jokeID);

    return (
        <>
            <section className="inner-container">
                <DadJoke joke={jokeID}/>
            </section>
        </>
    );
}

export default JokePage;
