// import React, { useState } from 'react';
// import { Book, User, Lock } from 'lucide-react';

// const LoginPage = ({ onLogin, setCurrentPage, therapistCredentials }) => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [loginType, setLoginType] = useState('student');

//     const handleLogin = () => {
//         if (loginType === 'therapist') {
//             if (username === therapistCredentials.username && password === therapistCredentials.password) {
//                 onLogin({ name: "Dr. Sarah Wilson", type: "therapist" }, 'therapist-dashboard');
//             } else {
//                 alert('Invalid therapist credentials!');
//             }
//         } else { // Student Login
//             if (username.trim() && password.trim()) {
//                 onLogin({ name: username, username, password, type: "student" }, 'dashboard');
//             } else {
//                 alert('Please enter your name and password.');
//             }
//         }
//     };

//     return (
//         <div className="min-vh-100 bg-gradient-page-login d-flex align-items-center justify-content-center p-3">
//             <div className="card shadow-lg rounded-5 p-4 p-md-5 w-100" style={{ maxWidth: '450px' }}>
//                 <div className="card-body">
//                     <div className="text-center mb-4">
//                         <div className="icon-circle bg-gradient-purple-pink mx-auto mb-3"><Book size={40} /></div>
//                         <h1 className="h3 fw-bold text-dark mb-1">Learning Fun!</h1>
//                         <p className="text-muted">Let's learn together!</p>
//                     </div>

//                     <div className="nav nav-pills nav-fill mb-4 bg-light rounded-pill p-1">
//                         <button onClick={() => setLoginType('student')} className={`nav-link rounded-pill fw-medium ${loginType === 'student' ? 'active bg-primary' : 'text-dark'}`}>Student</button>
//                         <button onClick={() => setLoginType('therapist')} className={`nav-link rounded-pill fw-medium ${loginType === 'therapist' ? 'active bg-primary' : 'text-dark'}`}>Therapist</button>
//                     </div>

//                     <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
//                         <div className="mb-3">
//                             <label className="form-label fw-medium"><User className="d-inline me-2" size={20} />{loginType === 'therapist' ? 'Username' : 'Your Name'}</label>
//                             <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control form-control-lg" placeholder={loginType === 'therapist' ? 'Enter username' : 'e.g., Alex'} required />
//                         </div>

//                         <div className="mb-3">
//                             <label className="form-label fw-medium"><Lock className="d-inline me-2" size={20} />Password</label>
//                             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control form-control-lg" placeholder="Enter password" required />
//                         </div>

//                         {loginType === 'therapist' && (
//                             <div className="alert alert-info small"><strong>Demo:</strong> therapist123 / secure2024</div>
//                         )}

//                         <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold hover-scale mt-3">{loginType === 'therapist' ? 'Access Dashboard' : "Let's Play!"}</button>
//                     </form>

//                     <div className="text-center mt-4">
//                         <button onClick={() => setCurrentPage('signup')} className="btn btn-link">New here? Sign up!</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;
// src/components/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { Book, User, Lock } from 'lucide-react';

// The 'therapistCredentials' prop is no longer needed
const LoginPage = ({ onLogin, setCurrentPage }) => { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginType, setLoginType] = useState('student');

    const handleLogin = async () => {
        const loginData = {
            username: username,
            password: password,
            loginType: loginType // Send the type of login to the backend
        };

        try {
            // API CALL to our backend's /login endpoint
            const res = await axios.post('http://localhost:5000/api/auth/login', loginData);

            // The backend sends back a token and user info on success
            const { token, user } = res.data;
            
            // Store the token and user in the browser's local storage for persistence
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Call the main onLogin function from App.js to update the state
            onLogin(user, user.role === 'therapist' ? 'therapist-dashboard' : 'dashboard');

        } catch (err) {
            // If the server sends an error (e.g., bad password, wrong login type)
            alert(err.response?.data?.msg || 'Login failed! Please check your details.');
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

                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <div className="mb-3">
                            <label className="form-label fw-medium"><User className="d-inline me-2" size={20} />{loginType === 'therapist' ? 'Username' : 'Student Username'}</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control form-control-lg" placeholder={loginType === 'therapist' ? 'Enter username' : 'e.g., alex123'} required />
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