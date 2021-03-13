import './App.css';
import DadJokesComponent from 'react-dadjokes'

function App() {
    return (
        <div id="wrapper">
            <section className="inner-container">
                <DadJokesComponent />
            </section>
            <div class="footer">
                <small>Made with ❤️ in Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 by <a href="https://twitter.com/will_patton_88">William Patton</a> - <a href="https://www.pattonwebz.com">PattonWebz</a>. <br /> Yes, Alan, I do live in Scotland.</small>
            </div>
        </div>
    );
}

export default App;
