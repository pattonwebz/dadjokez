import './App.css';
import { Route, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import JokePage from './pages/JokePage';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <>
            <Header />
            <main id="wrapper">
                <Switch>
                    <Route path="/" component={HomePage} exact />
                    <Route path="/about" component={AboutPage} />
                    <Route path="/joke/:jokeID" component={JokePage} />
                </Switch>
            </main>
            <Footer />
        </>
    );
}

export default App;
