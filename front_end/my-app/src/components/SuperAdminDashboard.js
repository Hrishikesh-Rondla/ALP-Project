// frontend/src/components/SuperAdminDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, UserCheck } from 'lucide-react';

const SuperAdminDashboard = ({ onLogout }) => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch pending therapists from the backend
    const fetchPendingTherapists = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/superadmin/pending-therapists');
            setPending(res.data);
        } catch (err) {
            console.error("Failed to fetch pending therapists", err);
            alert("Could not load data. Ensure you are logged in as admin and the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect hook to call the fetch function when the component loads
    useEffect(() => {
        fetchPendingTherapists();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/superadmin/approve-therapist/${id}`);
            alert('Therapist approved!');
            fetchPendingTherapists(); // Refresh the list automatically
        } catch (err) {
            alert('Failed to approve therapist.');
        }
    };

    if (loading) return <div className="p-5 text-center"><h2>Loading...</h2></div>;

    return (
        <div className="min-vh-100 bg-light p-3 p-lg-4">
            <div className="container-fluid">
                <div className="card shadow-sm rounded-4 p-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <div className="icon-circle bg-gradient-red-orange me-3"><Shield size={28} /></div>
                            <h1 className="h4 fw-bold text-dark mb-0">Super Admin Panel</h1>
                        </div>
                        <button onClick={onLogout} className="btn btn-danger">Logout</button>
                    </div>
                </div>

                <div className="card shadow-sm rounded-4">
                    <div className="card-header bg-white border-0 pt-3"><h2 className="h5 fw-bold text-dark">Pending Therapist Approvals</h2></div>
                    <div className="card-body">
                        <div className="table-responsive">
                            {pending.length === 0 ? (
                                <p className="text-muted text-center p-4">No pending approvals at this time.</p>
                            ) : (
                                <table className="table table-hover align-middle">
                                    <thead><tr><th>Name</th><th>Username</th><th>Application Date</th><th className="text-center">Action</th></tr></thead>
                                    <tbody>
                                        {pending.map(therapist => (
                                            <tr key={therapist._id}>
                                                <td>{therapist.name}</td>
                                                <td>{therapist.username}</td>
                                                <td>{new Date(therapist.joinDate).toLocaleDateString()}</td>
                                                <td className="text-center">
                                                    <button onClick={() => handleApprove(therapist._id)} className="btn btn-sm btn-success">
                                                        <UserCheck size={16} className="me-1" />Approve
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;