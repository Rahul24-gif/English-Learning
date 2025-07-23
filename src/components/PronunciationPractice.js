
import React, { useState } from 'react';

const PronunciationPractice = () => {
    const [textToSpeak, setTextToSpeak] = useState('');
    const [recognitionResult, setRecognitionResult] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isListening, setIsListening] = useState(false);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (recognition) {
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setRecognitionResult(transcript);
            comparePronunciation(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setFeedback('Error during speech recognition. Please try again.');
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
    }

    const startListening = () => {
        if (recognition) {
            setRecognitionResult('');
            setFeedback('');
            setIsListening(true);
            recognition.start();
        } else {
            setFeedback('Speech Recognition API not supported in this browser.');
        }
    };

    const comparePronunciation = (transcript) => {
        if (!textToSpeak) {
            setFeedback('Please enter text to practice.');
            return;
        }

        const spokenWords = transcript.toLowerCase().split(' ');
        const targetWords = textToSpeak.toLowerCase().split(' ');

        let correctWords = 0;
        for (let i = 0; i < targetWords.length; i++) {
            if (spokenWords[i] && spokenWords[i] === targetWords[i]) {
                correctWords++;
            }
        }

        const accuracy = (correctWords / targetWords.length) * 100;

        if (accuracy === 100) {
            setFeedback('Excellent! Perfect pronunciation.');
        } else if (accuracy >= 70) {
            setFeedback(`Good job! You got ${accuracy.toFixed(2)}% of the words correct.`);
        } else {
            setFeedback(`Keep practicing! You got ${accuracy.toFixed(2)}% of the words correct.`);
        }
    };

    return (
        <div className="pronunciation-practice-container">
            <h2>Pronunciation Practice</h2>
            <textarea
                placeholder="Enter text to practice pronunciation (e.g., 'Hello world')"
                value={textToSpeak}
                onChange={(e) => setTextToSpeak(e.target.value)}
                rows="4"
                cols="50"
            ></textarea>
            <button onClick={startListening} disabled={isListening}>
                {isListening ? 'Listening...' : 'Start Practice'}
            </button>
            {recognitionResult && <p>You said: "{recognitionResult}"</p>}
            {feedback && <p>Feedback: {feedback}</p>}
        </div>
    );
};

export default PronunciationPractice;
