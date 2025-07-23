
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VocabularyBuilder = () => {
    const [vocabulary, setVocabulary] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
        const fetchVocabulary = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/vocabulary');
                setVocabulary(response.data);
            } catch (error) {
                console.error('Error fetching vocabulary:', error);
            }
        };
        fetchVocabulary();
    }, []);

    const speakWord = (word) => {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const nextWord = () => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % vocabulary.length);
    };

    const prevWord = () => {
        setCurrentWordIndex((prevIndex) =>
            (prevIndex - 1 + vocabulary.length) % vocabulary.length
        );
    };

    const currentWord = vocabulary[currentWordIndex];

    return (
        <div className="vocabulary-builder-container">
            <h2>Vocabulary Builder</h2>
            {vocabulary.length > 0 ? (
                <div className="word-card">
                    <h3>{currentWord.word}</h3>
                    <p>Meaning: {currentWord.meaning}</p>
                    {currentWord.image && <img src={currentWord.image} alt={currentWord.word} />}
                    <p>Example: {currentWord.example}</p>
                    <button onClick={() => speakWord(currentWord.word)}>Pronounce</button>
                    <div className="navigation-buttons">
                        <button onClick={prevWord}>Previous</button>
                        <button onClick={nextWord}>Next</button>
                    </div>
                </div>
            ) : (
                <p>Loading vocabulary...</p>
            )}
        </div>
    );
};

export default VocabularyBuilder;
