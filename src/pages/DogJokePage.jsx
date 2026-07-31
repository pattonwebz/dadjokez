import DogJoke from '../components/DogJoke';
import usePageTitle from '../hooks/usePageTitle';

const DogJokePage = () => {
    usePageTitle('Dog Jokes');

    return (
        <section className="inner-container">
            <h2 className="visually-hidden">A random dog joke</h2>
            <DogJoke />
        </section>
    );
}

export default DogJokePage;
