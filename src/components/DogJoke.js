import React, { useState, useEffect } from 'react';
import '../dad-joke.css';

const DogJoke = (jokeRequest) => {

    const [id, setId] = useState('');
    const [joke, setJoke] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('https://icanhazdadjoke.com/search?term=dog', {
            headers: {
                'Accept': 'application/json',
                'User-Agent' : 'DadJokez (https://github.com/pattonwebz/dadjokez)'
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.results) {
                    throw Error;
                }
                const jokesCount = data.results.length;
                const randomDecimal = Math.random();
                const randomNumber = randomDecimal * jokesCount;
                const randomID = Math.floor(randomNumber);

                setId(data.results[randomID].id);
                setJoke(data.results[randomID].joke);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log('Error: ', err);
            })
    }, [jokeRequest]);

    if (!isLoading) {
        const url = window.location;
        const baseUrl = url.protocol + "//" + url.host + "/";

        return (
            <div
                id={id}
                className="dad-joke"
            >
                <p>
                    {joke}
                </p>
                <small className="permalink"><a href={baseUrl + 'joke/' + id}>Permalink</a></small>
            </div>
        );
    } else {
        return (
            <div className="joke joke--dog">
                <p>Loading...</p>
            </div>
        );
    }
}

export default DogJoke;
