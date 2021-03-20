import React, { useState, useEffect } from 'react';
import '../dad-joke.css';

const APIBase = 'https://icanhazdadjoke.com/';

const DadJoke = (jokeRequest) => {

    const [id, setId] = useState('');
    const [joke, setJoke] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const APIEndpoint = jokeRequest.joke ? `${APIBase}j/${jokeRequest.joke}` : APIBase;
        fetch(APIEndpoint, {
            headers: {
            Accept: 'application/json'
            }
        })
        .then((res) => res.json())
        .then((data) => {
            setId(data.id);
            setJoke(data.joke);
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
            <div className="dad-joke">
                <p>Loading...</p>
            </div>
        );
    }
}

export default DadJoke;
