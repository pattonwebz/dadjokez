import usePageTitle from '../hooks/usePageTitle';

const AboutPage = () => {
    usePageTitle('About');

    return (
        <section className="inner-container">
            <h2 className="page-title">About DadJokez</h2>
            <div>
                <p>This site is made just for a joke. It pulls jokes from the icanhazdadjoke.com API.</p>
                <p>It started as an excuse to get some practical use out of React, back when I did not touch it day-to-day. That part has changed since, so these days it is here purely to tell jokes.</p>
            </div>
        </section>
    );
}

export default AboutPage;
