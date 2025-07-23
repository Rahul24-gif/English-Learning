import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StoryReading from './components/StoryReading';
import PronunciationPractice from './components/PronunciationPractice';
import GrammarGames from './components/GrammarGames';
import VocabularyBuilder from './components/VocabularyBuilder';
import './App.css';
import './KidTheme.css'; // New theme for kids

function App() {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light'); // 'light' or 'dark'
    const [ageGroup, setAgeGroup] = useState('adult'); // 'kid', 'teen', 'adult'

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            const age = new Date().getFullYear() - parsedUser.birth_year;
            if (age <= 12) {
                setAgeGroup('kid');
            } else if (age <= 18) {
                setAgeGroup('teen');
            } else {
                setAgeGroup('adult');
            }
        }

        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            const age = new Date().getFullYear() - user.birth_year;
            if (age <= 12) {
                setAgeGroup('kid');
            } else if (age <= 18) {
                setAgeGroup('teen');
            } else {
                setAgeGroup('adult');
            }
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <Router>
            <div className={`App ${theme}-mode ${ageGroup}-theme`}>
                <button onClick={toggleTheme} className="theme-toggle-button">
                    Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                </button>
                <Routes>
                    <Route
                        path="/login"
                        element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />}
                    />
                    <Route
                        path="/dashboard"
                        element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/stories"
                        element={user ? <StoryReading /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/pronunciation"
                        element={user ? <PronunciationPractice /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/grammar"
                        element={user ? <GrammarGames /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/vocabulary"
                        element={user ? <VocabularyBuilder /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to={user ? "/dashboard" : "/login"} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;