

// import React, { useState } from 'react';
// import axios from 'axios';
// import { Star } from 'lucide-react';

// const SignupPage = ({ setCurrentPage }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         username: '',
//         password: '',
//     });

//     const { name, username, password } = formData;

//     const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSignup = async (e) => {
//         e.preventDefault();
//         if (!name || !username || !password) {
//             return alert('Please fill in all required fields.');
//         }
        
//         const newUser = {
//             name,
//             username,
//             password,
//             role: 'student' // All signups are for students
//         };

//         try {
//             // API CALL to our backend's /register endpoint
//             await axios.post('http://localhost:5000/api/auth/register', newUser);
            
//             alert('Registration successful! Please log in.');
//             setCurrentPage('login');

//         } catch (err) {
//             // If the server sends an error (like "Username already exists")
//             alert(err.response?.data?.msg || 'Registration failed. Please try again.');
//         }
//     };

//     return (
//         <div className="min-vh-100 bg-gradient-page-signup d-flex align-items-center justify-content-center p-3">
//             <div className="card shadow-lg rounded-5 p-4 p-md-5 w-100" style={{ maxWidth: '450px' }}>
//                 <div className="card-body">
//                     <div className="text-center mb-4">
//                         <div className="icon-circle bg-gradient-green-blue mx-auto mb-3">
//                             <Star size={40} />
//                         </div>
//                         <h1 className="h3 fw-bold text-dark mb-1">Join the Fun!</h1>
//                         <p className="text-muted">Create your account</p>
//                     </div>

//                     <form onSubmit={handleSignup}>
//                         <div className="mb-3">
//                             <input type="text" name="name" value={name} onChange={onChange} className="form-control form-control-lg" placeholder="Your Full Name" required />
//                         </div>
//                         <div className="mb-3">
//                             <input type="text" name="username" value={username} onChange={onChange} className="form-control form-control-lg" placeholder="Create a Username" required />
//                         </div>
//                         <div className="mb-3">
//                             <input type="password" name="password" value={password} onChange={onChange} className="form-control form-control-lg" placeholder="Create Password" required />
//                         </div>

//                         <button type="submit" className="btn bg-gradient-green-blue text-white btn-lg w-100 fw-bold hover-scale mt-3">
//                             Create Account
//                         </button>
//                     </form>

//                     <div className="text-center mt-4">
//                         <button onClick={() => setCurrentPage('login')} className="btn btn-link">
//                             Already have an account?
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SignupPage;

// src/components/SignupPage.js (Corrected for React Router)

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Star } from 'lucide-react';

const SignupPage = () => { // No longer needs setCurrentPage prop
    const [formData, setFormData] = useState({ name: '', username: '', password: '' });
    const navigate = useNavigate(); // Initialize the navigate function

    const { name, username, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!name || !username || !password) return alert('Please fill in all fields.');

        try {
            await axios.post('http://localhost:5000/api/auth/register', { name, username, password });
            alert('Registration successful! Please log in.');
            navigate('/login'); // Navigate to the login page on success
        } catch (err) {
            alert(err.response?.data?.msg || 'Registration failed.');
        }
    };

    return (
        <div className="min-vh-100 bg-gradient-page-signup d-flex align-items-center justify-content-center p-3">
            <div className="card shadow-lg rounded-5 p-4 p-md-5 w-100" style={{ maxWidth: '450px' }}>
                <div className="card-body">
                    <div className="text-center mb-4">
                        <div className="icon-circle bg-gradient-green-blue mx-auto mb-3"><Star size={40} /></div>
                        <h1 className="h3 fw-bold text-dark mb-1">Join the Fun!</h1>
                        <p className="text-muted">Create your account</p>
                    </div>

                    <form onSubmit={handleSignup}>
                        <div className="mb-3">
                            <input type="text" name="name" value={name} onChange={onChange} className="form-control form-control-lg" placeholder="Your Full Name" required />
                        </div>
                        <div className="mb-3">
                            <input type="text" name="username" value={username} onChange={onChange} className="form-control form-control-lg" placeholder="Create a Username" required />
                        </div>
                        <div className="mb-3">
                            <input type="password" name="password" value={password} onChange={onChange} className="form-control form-control-lg" placeholder="Create Password" required />
                        </div>
                        <button type="submit" className="btn bg-gradient-green-blue text-white btn-lg w-100 fw-bold hover-scale mt-3">Create Account</button>
                    </form>

                    <div className="text-center mt-4">
                        {/* --- THIS IS THE FIX --- */}
                        {/* Instead of calling setCurrentPage, we now navigate to the /login URL */}
                        <button onClick={() => navigate('/login')} className="btn btn-link">
                            Already have an account?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;