import React, { useState } from 'react';
import { Book, User, Lock } from 'lucide-react';
import api from '../api'; // Import the centralized API handler

const LoginPage = ({ onLogin, setCurrentPage }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginType, setLoginType] = useState('student');

    const handleLogin = async (e) => {
        // Prevent the form from refreshing the page
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            alert('Please enter both username and password.');
            return;
        }

        try {
            // Call the backend API using our centralized handler
            const res = await api.post('/auth/login', {
                username,
                password,
                loginType
            });

            // On success, pass the response data (token and user object) up to App.js
            onLogin(res.data);

        } catch (err) {
            // If the API returns an error, display it to the user
            const errorMessage = err.response?.data?.msg || "Login failed. Please check your credentials and try again.";
            alert(errorMessage);
            console.error("Login failed:", err);
        }
    };

    return (
        <div className="min-vh-100 bg-gradient-page-login d-flex align-items-center justify-content-center p-3">
            <div className="card shadow-lg rounded-5 p-4 p-md-5 w-100" style={{ maxWidth: '450px' }}>
                <div className="card-body">
                    <div className="text-center mb-4">
                        <div className="icon-circle bg-gradient-purple-pink mx-auto mb-3"><Book size={40} /></div>
                        <h1 className="h3 fw-bold text-dark mb-1">Learning Fun!</h1>
                        <p className="text-muted">Let's learn together!</p>
                    </div>

                    <div className="nav nav-pills nav-fill mb-4 bg-light rounded-pill p-1">
                        <button onClick={() => setLoginType('student')} className={`nav-link rounded-pill fw-medium ${loginType === 'student' ? 'active bg-primary' : 'text-dark'}`}>Student</button>
                        <button onClick={() => setLoginType('therapist')} className={`nav-link rounded-pill fw-medium ${loginType === 'therapist' ? 'active bg-primary' : 'text-dark'}`}>Therapist</button>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label fw-medium"><User className="d-inline me-2" size={20} />{loginType === 'therapist' ? 'Username' : 'Your Username'}</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control form-control-lg" placeholder="Enter username" required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-medium"><Lock className="d-inline me-2" size={20} />Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control form-control-lg" placeholder="Enter password" required />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold hover-scale mt-3">{loginType === 'therapist' ? 'Access Dashboard' : "Let's Play!"}</button>
                    </form>

                    <div className="text-center mt-4">
                        <button onClick={() => setCurrentPage('signup')} className="btn btn-link">New here? Sign up!</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;