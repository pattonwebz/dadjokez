import { Link } from 'react-router';

import { removeFavorite } from '../favorites';
import useFavorites from '../hooks/useFavorites';
import usePageTitle from '../hooks/usePageTitle';

import '../favorites.css';

const FavoritesPage = () => {
    const favorites = useFavorites();

    usePageTitle('Favorites');

    return (
        <section className="inner-container">
            <h2 className="page-title">Favorites</h2>
            <div>
                {favorites.length === 0 ? (
                    <p className="favorites__empty">
                        Nothing saved yet. Hit <em>Save</em> on a joke you like and it will
                        wait here for you.
                    </p>
                ) : (
                    <ul className="favorites">
                        {favorites.map((favorite) => (
                            <li key={favorite.id} className="favorites__item">
                                <p className="favorites__joke">{favorite.joke}</p>
                                <p className="favorites__meta">
                                    <Link to={`/joke/${favorite.id}`}>Permalink</Link>
                                    <button
                                        className="link-button"
                                        type="button"
                                        onClick={() => removeFavorite(favorite.id)}
                                    >
                                        Remove
                                    </button>
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

export default FavoritesPage;
