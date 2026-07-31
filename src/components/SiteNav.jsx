import { NavLink } from 'react-router';

import '../site-nav.css';

const navLinkClass = ({ isActive }) => (isActive ? 'is-active' : undefined);

const SiteNav = () => {
    return (
        <nav id="site-nav">
            <div className="site-title">
                <h1>Dad Jokez</h1>
            </div>
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
                    <NavLink to="/about" className={navLinkClass}>
                        About
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default SiteNav;
