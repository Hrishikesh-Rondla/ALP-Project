// frontend/src/components/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, User, Lock } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginType, setLoginType] = useState('student');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password, loginType });
            // Save user and token to local storage for session persistence
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            // Call the handleLogin function passed down from App.js
            onLogin(res.data.user);
        } catch (err) {
            // Display error message from the backend, or a generic one
            alert(err.response?.data?.msg || 'Login failed! Please check your details.');
        }
    };

    return (
        <div className="min-vh-100 bg-gradient-page-login d-flex align-items-center justify-content-center p-3">
            <div className="card shadow-lg rounded-5 p-4 p-md-5 w-100" style={{ maxWidth: '450px' }}>
                <div className="card-body">
                    <div className="text-center mb-4">
                        <div className="icon-circle bg-gradient-purple-pink mx-auto mb-3"><BrainCircuit size={40} /></div>
                        <h1 className="h3 fw-bold text-dark mb-1">Learning Fun!</h1>
                        <p className="text-muted">Let's learn together!</p>
                    </div>

                    <div className="nav nav-pills nav-fill mb-4 bg-light rounded-pill p-1">
                        <button onClick={() => setLoginType('student')} className={`nav-link rounded-pill fw-medium ${loginType === 'student' ? 'active bg-primary' : 'text-dark'}`}>Student</button>
                        <button onClick={() => setLoginType('therapist')} className={`nav-link rounded-pill fw-medium ${loginType === 'therapist' ? 'active bg-primary' : 'text-dark'}`}>Therapist</button>
                        <button onClick={() => setLoginType('superadmin')} className={`nav-link rounded-pill fw-medium ${loginType === 'superadmin' ? 'active bg-danger' : 'text-dark'}`}>Admin</button>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label fw-medium"><User className="d-inline me-2" size={20} />{loginType.charAt(0).toUpperCase() + loginType.slice(1)} Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control form-control-lg" placeholder="Enter username" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-medium"><Lock className="d-inline me-2" size={20} />Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control form-control-lg" placeholder="Enter password" required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold hover-scale mt-3">Login</button>
                    </form>

                    <div className="text-center mt-4">
                        <button onClick={() => navigate('/signup')} className="btn btn-link">New Student? Sign up here!</button>
                        <br />
                        <button onClick={() => navigate('/therapist-signup')} className="btn btn-link">Therapist? Apply for an account</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;