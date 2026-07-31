import { Route, Routes } from 'react-router';

import './App.css';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import JokePage from './pages/JokePage';
import DogJokePage from './pages/DogJokePage';

import SiteNav from './components/SiteNav';
import Footer from './components/Footer';

const App = () => {
    return (
        <>
            <SiteNav />
            <main id="wrapper">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dog-joke" element={<DogJokePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/joke/:jokeID" element={<JokePage />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

export default App;
