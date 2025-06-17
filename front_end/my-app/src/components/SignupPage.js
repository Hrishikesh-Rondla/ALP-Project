import React from 'react';
import { Star } from 'lucide-react';

const SignupPage = ({ setCurrentPage }) => {
    return (
        <div className="min-vh-100 bg-gradient-page-signup d-flex align-items-center justify-content-center p-3">
            <div className="card shadow-lg rounded-5 p-4 p-md-5 w-100" style={{ maxWidth: '450px' }}>
                <div className="card-body">
                    <div className="text-center mb-4">
                        <div className="icon-circle bg-gradient-green-blue mx-auto mb-3">
                            <Star size={40} />
                        </div>
                        <h1 className="h3 fw-bold text-dark mb-1">Join the Fun!</h1>
                        <p className="text-muted">Create your account</p>
                    </div>

                    <form onSubmit={() => setCurrentPage('login')}>
                        <div className="mb-3">
                            <input type="text" className="form-control form-control-lg" placeholder="Your Name" required />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control form-control-lg" placeholder="Email (optional)" />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control form-control-lg" placeholder="Create Password" required />
                        </div>

                        <button type="submit" className="btn bg-gradient-green-blue text-white btn-lg w-100 fw-bold hover-scale mt-3">
                            Create Account
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <button onClick={() => setCurrentPage('login')} className="btn btn-link">
                            Already have an account?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;