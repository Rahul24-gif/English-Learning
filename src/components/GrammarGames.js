
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GrammarGames = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState({});
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/quizzes');
                setQuizzes(response.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };
        fetchQuizzes();
    }, []);

    const startQuiz = (quiz) => {
        setCurrentQuiz(quiz);
        setSelectedAnswer({});
        setScore(0);
        setShowResults(false);
    };

    const handleAnswerSelect = (questionIndex, option) => {
        setSelectedAnswer(prev => ({
            ...prev,
            [questionIndex]: option
        }));
    };

    const handleSubmitQuiz = () => {
        let newScore = 0;
        currentQuiz.questions.forEach((q, index) => {
            if (selectedAnswer[index] === q.answer) {
                newScore++;
            }
        });
        setScore(newScore);
        setShowResults(true);
    };

    return (
        <div className="grammar-games-container">
            <h2>Grammar Games</h2>
            {!currentQuiz ? (
                <div className="quiz-list">
                    {quizzes.map(quiz => (
                        <div key={quiz.id} className="quiz-item">
                            <h3>{quiz.title}</h3>
                            <p>Level: {quiz.level}</p>
                            <button onClick={() => startQuiz(quiz)}>Start Quiz</button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="current-quiz">
                    <h3>{currentQuiz.title}</h3>
                    {!showResults ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmitQuiz(); }}>
                            {currentQuiz.questions.map((q, qIndex) => (
                                <div key={qIndex} className="question-item">
                                    <p>{q.q}</p>
                                    <div className="options">
                                        {q.options.map((option, oIndex) => (
                                            <label key={oIndex}>
                                                <input
                                                    type="radio"
                                                    name={`question-${qIndex}`}
                                                    value={option}
                                                    checked={selectedAnswer[qIndex] === option}
                                                    onChange={() => handleAnswerSelect(qIndex, option)}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button type="submit">Submit Quiz</button>
                        </form>
                    ) : (
                        <div className="quiz-results">
                            <h4>Quiz Results</h4>
                            <p>You scored {score} out of {currentQuiz.questions.length}!</p>
                            <button onClick={() => setCurrentQuiz(null)}>Back to Quizzes</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GrammarGames;
