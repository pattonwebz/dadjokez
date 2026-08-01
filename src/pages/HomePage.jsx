import QueuedJoke from '../components/QueuedJoke';
import usePageTitle from '../hooks/usePageTitle';

const HomePage = () => {
    usePageTitle();

    return (
        <section className="inner-container">
            <h2 className="visually-hidden">A random dad joke</h2>
            <QueuedJoke source="random" />
        </section>
    );
}

export default HomePage;
