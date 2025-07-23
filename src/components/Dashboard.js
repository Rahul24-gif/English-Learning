import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user }) => {
    const [progress, setProgress] = useState(user.progress);

    const getAge = (birthYear) => {
        return new Date().getFullYear() - birthYear;
    };

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/user/${user.id}/progress`);
                setProgress(response.data);
            } catch (error) {
                console.error('Error fetching progress:', error);
            }
        };
        fetchProgress();
    }, [user.id]);

    return (
        <div className="dashboard-container">
            <h2>Welcome, {user.name}!</h2>
            <p>Age: {getAge(user.birth_year)}</p>
            <p>Last Activity: {progress.last_activity || 'None'}</p>
            <p>Daily Streak: {progress.streak}</p>
            {/* Add more progress stats here */}

            <h3>Learning Modules</h3>
            <nav>
                <ul>
                    <li><Link to="/stories">Story Reading</Link></li>
                    <li><Link to="/pronunciation">Pronunciation Practice</Link></li>
                    <li><Link to="/grammar">Grammar Games</Link></li>
                    <li><Link to="/vocabulary">Vocabulary Builder</Link></li>
                </ul>
            </nav>

            <button>Resume Learning</button>
        </div>
    );
};

export default Dashboard;