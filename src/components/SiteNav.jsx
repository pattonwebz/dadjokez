import { NavLink } from 'react-router';

import useFavorites from '../hooks/useFavorites';

import '../site-nav.css';

const navLinkClass = ({ isActive }) => (isActive ? 'is-active' : undefined);

const SiteNav = () => {
    const favorites = useFavorites();

    return (
        <nav id="site-nav" aria-label="Main">
            <ul className="nav">
                <li>
                    <NavLink to="/" className={navLinkClass} end>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dog-joke" className={navLinkClass}>
                        Dog Joke
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/favorites" className={navLinkClass}>
                        Favorites
                        {favorites.length > 0 && (
                            <span className="nav__count"> ({favorites.length})</span>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about" className={navLinkClass}>
                        About
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default SiteNav;
