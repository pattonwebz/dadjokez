import { Link } from 'react-router';

const NotFoundPage = () => {
    return (
        <section className="inner-container">
            <h2 className="page-title">404</h2>
            <div>
                <p>That page has wandered off. It probably went out for milk.</p>
                <p>
                    <Link to="/">Have a joke instead</Link>
                </p>
            </div>
        </section>
    );
}

export default NotFoundPage;
