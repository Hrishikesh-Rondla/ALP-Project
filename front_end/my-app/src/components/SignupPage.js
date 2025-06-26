import React, { useState } from 'react';
import { UserPlus, User, Lock, Smile, AlertCircle } from 'lucide-react';
import api from '../api'; // Our centralized API handler

const SignupPage = ({ onLogin, setCurrentPage }) => {
    // --- STATE MANAGEMENT ---
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // New states for better UX
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- HANDLER FUNCTION ---
    const handleSignup = async (e) => {
        e.preventDefault(); // Prevent page refresh
        setError(null); // Clear previous errors

        // 1. Frontend Validation
        if (!name.trim() || !username.trim() || !password.trim()) {
            setError('Please fill out all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // 2. Set loading state
        setLoading(true);

        try {
            // 3. Call the backend registration route
            const res = await api.post('/auth/register', {
                name,
                username,
                password,
                role: 'student' // Hardcoding the role for student signup
            });

            // 4. On success, show an alert and log the user in
            alert('Signup successful! You are now logged in.');
            onLogin(res.data);

        } catch (err) {
            // 5. Display any error messages from the server
            const errorMessage = err.response?.data?.msg || "Signup failed. Please try again.";
            setError(errorMessage);
            console.error("Signup failed:", err);
        } finally {
            // 6. Always turn off the loading state
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-gradient-page-signup d-flex align-items-center justify-content-center p-3">
            <div className="card shadow-lg rounded-5 p-4 p-md-5 w-100" style={{ maxWidth: '450px' }}>
                <div className="card-body">
                    <div className="text-center mb-4">
                        <div className="icon-circle bg-gradient-green-blue mx-auto mb-3"><UserPlus size={40} /></div>
                        <h1 className="h3 fw-bold text-dark mb-1">Join the Fun!</h1>
                        <p className="text-muted">Create your student account.</p>
                    </div>

                    <form onSubmit={handleSignup}>
                        <div className="mb-3">
                            <label className="form-label fw-medium"><Smile className="d-inline me-2" size={20} />Your Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control form-control-lg" placeholder="e.g., Alex Smith" required disabled={loading} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-medium"><User className="d-inline me-2" size={20} />Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control form-control-lg" placeholder="e.g., alex123" required disabled={loading} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-medium"><Lock className="d-inline me-2" size={20} />Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control form-control-lg" placeholder="Choose a secure password" required disabled={loading} />
                        </div>
                        {/* --- NEW CONFIRM PASSWORD FIELD --- */}
                        <div className="mb-3">
                            <label className="form-label fw-medium"><Lock className="d-inline me-2" size={20} />Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control form-control-lg" placeholder="Type your password again" required disabled={loading} />
                        </div>

                        {/* --- NEW INLINE ERROR DISPLAY --- */}
                        {error && (
                            <div className="alert alert-danger d-flex align-items-center p-2 small" role="alert">
                                <AlertCircle size={20} className="me-2" />
                                <div>{error}</div>
                            </div>
                        )}

                        <div className="d-grid mt-4">
                            <button type="submit" className="btn btn-success btn-lg fw-bold hover-scale" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        <button onClick={() => setCurrentPage('login')} className="btn btn-link">Already have an account? Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;