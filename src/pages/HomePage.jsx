import DadJoke from '../components/DadJoke';
import usePageTitle from '../hooks/usePageTitle';

const HomePage = () => {
    usePageTitle();

    return (
        <section className="inner-container">
            <h2 className="visually-hidden">A random dad joke</h2>
            <DadJoke />
        </section>
    );
}

export default HomePage;
