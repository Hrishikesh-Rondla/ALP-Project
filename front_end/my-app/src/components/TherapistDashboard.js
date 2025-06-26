// import React from 'react';
// import { BarChart3, Users, Eye, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

// const StatCard = ({ title, value, icon, color }) => (
//     <div className="col-md-6 col-lg-3 mb-4">
//         <div className="card shadow-sm border-0 h-100">
//             <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-center">
//                     <div>
//                         <p className="text-muted mb-1">{title}</p>
//                         <p className={`h3 fw-bold text-${color} mb-0`}>{value}</p>
//                     </div>
//                     {React.createElement(icon, { className: `text-${color}`, size: 48, strokeWidth: 1.5 })}
//                 </div>
//             </div>
//         </div>
//     </div>
// );

// const PerformanceCell = ({ performance, color }) => (
//     <td className="text-center align-middle">
//         <div className="d-flex align-items-center justify-content-center">
//             <span className={`fw-semibold text-${color} me-2`}>{performance.percentage}%</span>
//             <span className={`badge bg-${color}-subtle text-${color}-emphasis small`}>{performance.improvement}</span>
//         </div>
//         <div className="progress mx-auto mt-1" style={{ height: '6px', width: '80px' }}>
//             <div className={`progress-bar bg-${color}`} style={{ width: `${performance.percentage}%` }}></div>
//         </div>
//         <p className="small text-muted mb-0 mt-1">{performance.correct}/{performance.total}</p>
//     </td>
// );

// const TherapistDashboard = ({ user, studentsData, onLogout }) => (
//     <div className="min-vh-100 bg-gradient-page-therapist p-3 p-lg-4">
//         <div className="container-fluid">
//             {/* Header */}
//             <div className="card shadow-sm rounded-4 p-3 mb-4">
//                 <div className="d-flex flex-wrap justify-content-between align-items-center">
//                     <div className="d-flex align-items-center">
//                         <div className="icon-circle bg-gradient-blue-indigo me-3" style={{ width: '4rem', height: '4rem' }}>
//                             <BarChart3 size={28} />
//                         </div>
//                         <div>
//                             <h1 className="h4 fw-bold text-dark mb-0">Therapist Dashboard</h1>
//                             <p className="text-muted mb-0">Welcome back, {user?.name}</p>
//                         </div>
//                     </div>
//                     <button onClick={onLogout} className="btn btn-danger mt-2 mt-md-0">
//                         Logout
//                     </button>
//                 </div>
//             </div>

//             {/* Overview Stats */}
//             <div className="row">
//                 <StatCard title="Total Students" value={studentsData.length} icon={Users} color="primary" />
//                 <StatCard title="Active Sessions" value="54" icon={Calendar} color="success" />
//                 <StatCard title="Avg Progress" value="76%" icon={TrendingUp} color="info" />
//                 <StatCard title="Completed" value="342" icon={CheckCircle} color="warning" />
//             </div>

//             {/* Student Performance Table */}
//             <div className="card shadow-sm rounded-4 mt-2">
//                 <div className="card-header bg-white border-0 pt-3">
//                     <h2 className="h5 fw-bold text-dark">Student Performance Overview</h2>
//                 </div>
//                 <div className="card-body">
//                     <div className="table-responsive">
//                         <table className="table table-hover">
//                             <thead>
//                                 <tr>
//                                     <th className="fw-semibold text-muted">Student</th>
//                                     <th className="text-center fw-semibold text-muted">Age</th>
//                                     <th className="text-center fw-semibold text-muted">Sessions</th>
//                                     <th className="text-center fw-semibold text-muted">Easy</th>
//                                     <th className="text-center fw-semibold text-muted">Medium</th>
//                                     <th className="text-center fw-semibold text-muted">Hard</th>
//                                     <th className="text-center fw-semibold text-muted">Streak</th>
//                                     <th className="text-center fw-semibold text-muted">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {studentsData.map((student) => (
//                                     <tr key={student.id}>
//                                         <td className="align-middle">
//                                             <div className="d-flex align-items-center">
//                                                 <div className="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
//                                                     <span className="fw-bold">{student.name.charAt(0)}</span>
//                                                 </div>
//                                                 <div>
//                                                     <p className="fw-semibold text-dark mb-0">{student.name}</p>
//                                                     <p className="small text-muted mb-0">Joined {new Date(student.joinDate).toLocaleDateString()}</p>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="text-center align-middle">
//                                             <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">{student.age} years</span>
//                                         </td>
//                                         <td className="text-center fw-semibold align-middle">{student.totalSessions}</td>
//                                         <PerformanceCell performance={student.performance.easy} color="success" />
//                                         <PerformanceCell performance={student.performance.medium} color="warning" />
//                                         <PerformanceCell performance={student.performance.hard} color="danger" />
//                                         <td className="text-center align-middle">
//                                             <span className="fw-bold text-warning">{student.streakDays} 🔥</span>
//                                         </td>

//                                         <td className="text-center align-middle">
//                                             <button className="btn btn-sm btn-outline-primary">
//                                                 <Eye size={16} className="me-1" /> View
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// );

// export default TherapistDashboard;
// src/components/TherapistDashboard.js (Final, Robust Version)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Users, Eye, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

// This is a helper component for the stats at the top. It remains the same.
const StatCard = ({ title, value, icon, color }) => (
    <div className="col-md-6 col-lg-3 mb-4">
        <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <p className="text-muted mb-1">{title}</p>
                        <p className={`h3 fw-bold text-${color} mb-0`}>{value}</p>
                    </div>
                    {React.createElement(icon, { className: `text-${color}`, size: 48, strokeWidth: 1.5 })}
                </div>
            </div>
        </div>
    </div>
);

// This is a helper component for displaying performance in the table.
// It is now more robust and calculates its own color.
const PerformanceCell = ({ performance }) => {
    // Defensive check: If performance data doesn't exist for a level, show 'N/A'.
    if (!performance || typeof performance.correct === 'undefined' || typeof performance.total === 'undefined') {
        return <td className="text-center align-middle text-muted">N/A</td>;
    }

    const percentage = performance.total > 0 ? Math.round((performance.correct / performance.total) * 100) : 0;
    const color = percentage >= 70 ? 'success' : percentage >= 40 ? 'warning' : 'danger';
    
    return (
        <td className="text-center align-middle">
            <span className={`fw-semibold text-${color} me-2`}>{percentage}%</span>
            <div className="progress mx-auto mt-1" style={{ height: '6px', width: '80px' }}>
                <div className={`progress-bar bg-${color}`} style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="small text-muted mb-0 mt-1">{performance.correct}/{performance.total}</p>
        </td>
    );
};


// This is the main Dashboard component. It no longer accepts 'studentsData' as a prop.
// Instead, it fetches its own data.
const TherapistDashboard = ({ user, onLogout }) => {
    const [students, setStudents] = useState(null); // Initialize to null to track loading state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // This function runs once when the component is first rendered.
        const fetchStudents = async () => {
            setLoading(true);
            setError('');
            try {
                // We don't need to send a token if the route is public, but it's good practice for later.
                // const token = localStorage.getItem('token');
                // const config = { headers: { 'x-auth-token': token } };
                
                // Make the API call to our backend to get the list of students.
                const res = await axios.get('http://localhost:5000/api/users/students');
                setStudents(res.data);
                
            } catch (err) {
                console.error("Failed to fetch students:", err);
                setError("Could not load student data. Please ensure the backend server is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []); // The empty array [] means this effect runs only once.


    // --- Robust UI States ---
    // 1. Show a loading message while the API call is in progress.
    if (loading) {
        return <div className="p-5 text-center"><h2><div className="spinner-border me-2" />Loading Student Data...</h2></div>;
    }

    // 2. Show an error message if the API call failed.
    if (error) {
        return <div className="p-5 text-center"><h2 className="text-danger">An Error Occurred</h2><p>{error}</p></div>;
    }
    
    // 3. This check prevents the crash. If 'students' is still not an array, show a message.
    if (!Array.isArray(students)) {
         return <div className="p-5 text-center"><h2>Could not display student data.</h2></div>;
    }
    // -------------------------

    return (
        <div className="min-vh-100 bg-gradient-page-therapist p-3 p-lg-4">
            <div className="container-fluid">
                {/* Header */}
                <div className="card shadow-sm rounded-4 p-3 mb-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <div className="icon-circle bg-gradient-blue-indigo me-3"><BarChart3 size={28} /></div>
                            <div>
                                <h1 className="h4 fw-bold text-dark mb-0">Therapist Dashboard</h1>
                                <p className="text-muted mb-0">Welcome back, {user?.name}</p>
                            </div>
                        </div>
                        <button onClick={onLogout} className="btn btn-danger mt-2 mt-md-0">Logout</button>
                    </div>
                </div>

                {/* Overview Stats - Now using the length of the fetched students array */}
                <div className="row">
                    <StatCard title="Total Students" value={students.length} icon={Users} color="primary" />
                    <StatCard title="Active Sessions" value="N/A" icon={Calendar} color="success" />
                    <StatCard title="Avg Progress" value="N/A" icon={TrendingUp} color="info" />
                    <StatCard title="Completed" value="N/A" icon={CheckCircle} color="warning" />
                </div>
                
                {/* Student Performance Table - Now mapping over the fetched students array */}
                <div className="card shadow-sm rounded-4 mt-2">
                    <div className="card-header bg-white border-0 pt-3">
                        <h2 className="h5 fw-bold text-dark">Student Performance Overview</h2>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th className="text-center">Joined</th>
                                        <th className="text-center">Easy</th>
                                        <th className="text-center">Medium</th>
                                        <th className="text-center">Hard</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center p-4">No students have signed up yet.</td></tr>
                                    ) : (
                                        students.map((student) => (
                                            <tr key={student._id}>
                                                <td className="align-middle">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                            <span className="fw-bold">{student.name.charAt(0)}</span>
                                                        </div>
                                                        <div>
                                                            <p className="fw-semibold text-dark mb-0">{student.name}</p>
                                                            <p className="small text-muted mb-0">@{student.username}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center align-middle">{new Date(student.joinDate).toLocaleDateString()}</td>
                                                {/* Use optional chaining '?' to prevent errors if performance object doesn't exist */}
                                                <PerformanceCell performance={student.performance?.easy} />
                                                <PerformanceCell performance={student.performance?.medium} />
                                                <PerformanceCell performance={student.performance?.hard} />
                                                <td className="text-center align-middle">
                                                    <button className="btn btn-sm btn-outline-primary"><Eye size={16} className="me-1" /> View</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TherapistDashboard;