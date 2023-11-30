import React, { useState, useEffect } from 'react';

const DogJokes = () => {
    const [joke, setJoke] = useState('');

    const fetchJoke = async () => {
        const response = await fetch('https://dog-api.kinduff.com/api/facts');
        const data = await response.json();
        setJoke(data.facts[0]);
    };

    useEffect(() => {
        fetchJoke()
            .catch(() => console.log('Error fetching joke!'));
    }, []);

    return (
        <div
            className="joke joke--dog"
        >
            <p>
                {joke}
            </p>
        </div>
    );
};

export default DogJokes;
