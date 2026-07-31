import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router';

import './App.css';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import JokePage from './pages/JokePage';
import DogJokePage from './pages/DogJokePage';
import NotFoundPage from './pages/NotFoundPage';

import SiteNav from './components/SiteNav';
import Footer from './components/Footer';

const App = () => {
    const location = useLocation();
    const mainRef = useRef(null);
    const isFirstRender = useRef(true);

    // Following a link swaps the page content without moving the keyboard
    // focus or telling assistive tech that anything changed. Sending focus to
    // the new page's container gives both a sensible place to start reading.
    // Skipped on first render so a fresh page load is left alone.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        mainRef.current?.focus();
    }, [location.pathname]);

    return (
        <>
            <a className="skip-link" href="#wrapper">
                Skip to content
            </a>
            <header id="site-header">
                <div className="site-title">
                    <h1>Dad Jokez</h1>
                </div>
                <SiteNav />
            </header>
            <main id="wrapper" ref={mainRef} tabIndex={-1}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dog-joke" element={<DogJokePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/joke/:jokeID" element={<JokePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

export default App;
