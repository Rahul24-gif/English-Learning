
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setUser }) => {
    const [name, setName] = useState('');
    const [birthYear, setBirthYear] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/login', {
                name,
                birth_year: parseInt(birthYear)
            });
            setUser(response.data);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>Welcome!</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Enter your birth year"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
