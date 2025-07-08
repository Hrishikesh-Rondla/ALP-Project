// frontend/src/components/TherapistSignupPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const TherapistSignupPage = () => {
    const [formData, setFormData] = useState({ name: '', username: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // This calls the new backend route specifically for therapists
            const res = await axios.post('http://localhost:5000/api/auth/register-therapist', formData);
            alert(res.data.msg); // Show success message (e.g., "Application submitted")
            navigate('/login'); // Redirect to login page
        } catch (err) {
            alert(err.response?.data?.msg || 'Application failed.');
        }
    };

    return (
        <div className="min-vh-100 bg-gradient-page-signup d-flex align-items-center justify-content-center p-3">
            <div className="card shadow-lg rounded-5 p-4 p-md-5 w-100" style={{ maxWidth: '450px' }}>
                <div className="card-body">
                    <div className="text-center mb-4">
                        <div className="icon-circle bg-gradient-blue-indigo mx-auto mb-3"><Briefcase size={40} /></div>
                        <h1 className="h3 fw-bold text-dark mb-1">Therapist Application</h1>
                        <p className="text-muted">Submit your details for approval.</p>
                    </div>
                    <form onSubmit={handleSignup}>
                        <div className="mb-3"><input type="text" name="name" value={formData.name} onChange={onChange} className="form-control form-control-lg" placeholder="Your Full Name" required /></div>
                        <div className="mb-3"><input type="text" name="username" value={formData.username} onChange={onChange} className="form-control form-control-lg" placeholder="Create a Username" required /></div>
                        <div className="mb-3"><input type="password" name="password" value={formData.password} onChange={onChange} className="form-control form-control-lg" placeholder="Create Password" required /></div>
                        <button type="submit" className="btn bg-gradient-blue-indigo text-white btn-lg w-100 fw-bold hover-scale mt-3">Submit for Approval</button>
                    </form>
                    <div className="text-center mt-4">
                        <button onClick={() => navigate('/login')} className="btn btn-link">Back to Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TherapistSignupPage;