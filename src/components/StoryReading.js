
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StoryReading = () => {
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [utterance, setUtterance] = useState(null);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/stories');
                setStories(response.data);
            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        };
        fetchStories();
    }, []);

    useEffect(() => {
        if (selectedStory) {
            const newUtterance = new SpeechSynthesisUtterance();
            newUtterance.lang = 'en-US';
            newUtterance.onend = () => {
                if (currentSentenceIndex < selectedStory.content.split('. ').length - 1) {
                    setCurrentSentenceIndex(currentSentenceIndex + 1);
                } else {
                    setCurrentSentenceIndex(0);
                    setSelectedStory(null); // Story finished
                }
            };
            setUtterance(newUtterance);
        }
    }, [selectedStory, currentSentenceIndex]);

    const readSentence = (sentence) => {
        if (utterance) {
            utterance.text = sentence;
            window.speechSynthesis.speak(utterance);
        }
    };

    const startReading = (story) => {
        setSelectedStory(story);
        setCurrentSentenceIndex(0);
        const sentences = story.content.split('. ');
        readSentence(sentences[0]);
    };

    const stopReading = () => {
        if (utterance) {
            window.speechSynthesis.cancel();
        }
        setSelectedStory(null);
        setCurrentSentenceIndex(0);
    };

    return (
        <div className="story-reading-container">
            <h2>Story Reading</h2>
            {!selectedStory ? (
                <div className="story-list">
                    {stories.map(story => (
                        <div key={story.id} className="story-item">
                            <h3>{story.title}</h3>
                            <p>Level: {story.level}</p>
                            <button onClick={() => startReading(story)}>Read Story</button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="current-story">
                    <h3>{selectedStory.title}</h3>
                    <p>
                        {selectedStory.content.split('. ').map((sentence, index) => (
                            <span
                                key={index}
                                className={index === currentSentenceIndex ? 'highlighted-sentence' : ''}
                            >
                                {sentence}. 
                            </span>
                        ))}
                    </p>
                    <button onClick={stopReading}>Stop Reading</button>
                </div>
            )}
        </div>
    );
};

export default StoryReading;
