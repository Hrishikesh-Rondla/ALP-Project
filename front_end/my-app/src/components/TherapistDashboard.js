

// frontend/src/components/TherapistDashboard.js (FINAL - FULLY THEME-AWARE)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart3, Users, Eye, TrendingUp, TrendingDown, Search } from 'lucide-react';

// --- This component now uses CSS variables implicitly via Bootstrap classes ---
const StudentFocusCard = ({ student, metric, metricLabel, color }) => (
    <div className="d-flex align-items-center justify-content-between p-3 border-bottom" style={{ borderColor: 'var(--border-color)'}}>
        <div className="d-flex align-items-center">
            <div className={`avatar bg-${color}-subtle text-${color}-emphasis rounded-circle me-3 d-flex align-items-center justify-content-center`} style={{ width: '40px', height: '40px' }}>
                <span className="fw-bold">{student.name.charAt(0)}</span>
            </div>
            <div>
                <p className="fw-semibold mb-0" style={{ color: 'var(--text-primary)'}}>{student.name}</p>
                <p className="small mb-0" style={{ color: 'var(--text-secondary)'}}>@{student.username}</p>
            </div>
        </div>
        <Link to={`/student/${student._id}`} className={`badge fs-6 bg-${color} bg-opacity-75 text-white rounded-pill text-decoration-none px-3 py-2`}>
            {metric}{metricLabel}
        </Link>
    </div>
);

const PerformanceCell = ({ performance }) => {
    // ... This component is fine as it uses color classes that adapt well.
    if (!performance || typeof performance.correct === 'undefined' || typeof performance.total === 'undefined') return <td className="text-center align-middle" style={{ color: 'var(--text-secondary)'}}>N/A</td>;
    const percentage = performance.total > 0 ? Math.round((performance.correct / performance.total) * 100) : 0;
    const color = percentage >= 70 ? 'success' : percentage >= 40 ? 'warning' : 'danger';
    return (<td className="text-center align-middle"><span className={`fw-semibold text-${color} me-2`}>{percentage}%</span><div className="progress mx-auto mt-1" style={{ height: '6px', width: '80px' }}><div className={`progress-bar bg-${color}`} style={{ width: `${percentage}%` }}></div></div><p className="small mt-1 mb-0" style={{ color: 'var(--text-secondary)'}}>{performance.correct}/{performance.total}</p></td>);
};

const TherapistDashboard = ({ user, onLogout }) => {
    const [students, setStudents] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, statsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/users/students'),
                    axios.get('http://localhost:5000/api/stats/dashboard')
                ]);
                setStudents(studentsRes.data);
                setDashboardStats(statsRes.data);
            } catch (err) {
                setError("Could not load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-5 text-center"><h2><div className="spinner-border me-2" />Loading Dashboard...</h2></div>;
    if (error) return <div className="p-5 text-center"><h2 className="text-danger">{error}</h2></div>;


    return (
        <div className="min-vh-100 p-3 p-lg-4" style={{ backgroundColor: 'var(--background-page)' }}>
            <div className="container-fluid">
                {/* --- HEADER --- */}
                <div className="card shadow-sm rounded-4 p-3 mb-4" style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--border-color)'}}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <div className="icon-circle bg-primary text-white me-3"><BarChart3 size={28} /></div>
                            <div>
                                <h1 className="h4 fw-bold mb-0" style={{ color: 'var(--text-primary)'}}>Therapist Dashboard</h1>
                                <p className="mb-0" style={{ color: 'var(--text-secondary)'}}>Welcome back, {user?.name}</p>
                            </div>
                        </div>
                        {/* The local ThemeSwitcher has been REMOVED. The global one in App.js will handle it. */}
                        <button onClick={onLogout} className="btn btn-danger mt-2 mt-md-0">Logout</button>
                    </div>
                </div>

                {/* --- FOCUS SECTION --- */}
                <div className="row">
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow-sm h-100 border-start border-primary border-4" style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--primary-color)'}}>
                            <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
                                <Users className="text-primary mb-2" size={48} />
                                <p className="display-4 fw-bold mb-1" style={{ color: 'var(--text-primary)'}}>{dashboardStats?.totalStudentCount || 0}</p>
                                <p className="text-uppercase small fw-bold" style={{ color: 'var(--text-secondary)'}}>Total Students</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow-sm h-100" style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--border-color)'}}>
                            <div className="card-header border-0 d-flex align-items-center py-3" style={{ backgroundColor: 'transparent' }}><TrendingUp className="text-success me-2" size={20} /><h3 className="h6 fw-bold mb-0 text-uppercase" style={{ color: 'var(--text-primary)'}}>Top Performers</h3></div>
                            {dashboardStats?.topPerformers.map(s => <StudentFocusCard key={s._id} student={s} metric={s.score} metricLabel=" pts" color="success" />)}
                        </div>
                    </div>
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow-sm h-100" style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--border-color)'}}>
                            <div className="card-header border-0 d-flex align-items-center py-3" style={{ backgroundColor: 'transparent' }}><TrendingDown className="text-danger me-2" size={20} /><h3 className="h6 fw-bold mb-0 text-uppercase" style={{ color: 'var(--text-primary)'}}>Students for Review</h3></div>
                            {dashboardStats?.studentsForReview.map(s => <StudentFocusCard key={s._id} student={s} metric={s.average} metricLabel="%" color="danger" />)}
                        </div>
                    </div>
                </div>

                {/* --- TABLE SECTION --- */}
                <div className="card shadow-sm rounded-4 mt-2" style={{ backgroundColor: 'var(--background-card)'}}>
                    <div className="card-header border-0 pt-3 pb-0 d-flex flex-wrap justify-content-between align-items-center" style={{ backgroundColor: 'transparent'}}>
                        <h2 className="h5 fw-bold" style={{ color: 'var(--text-primary)'}}>Full Student Overview</h2>
                        <div className="input-group mb-3" style={{ maxWidth: '300px' }}>
                            <span className="input-group-text border-0" style={{ backgroundColor: 'var(--background-page)'}}><Search size={16} style={{ color: 'var(--text-secondary)'}}/></span>
                            {/* FIX: Added style to make the search text visible in dark mode */}
                            <input type="text" className="form-control border-0" style={{ backgroundColor: 'var(--background-page)', color: 'var(--text-primary)'}} placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        {/* FIX: Added style to make table headers visible */}
                                        <th style={{ color: 'var(--text-primary)'}}>Student</th>
                                        <th className="text-center" style={{ color: 'var(--text-primary)'}}>Joined</th>
                                        <th className="text-center" style={{ color: 'var(--text-primary)'}}>Easy</th>
                                        <th className="text-center" style={{ color: 'var(--text-primary)'}}>Medium</th>
                                        <th className="text-center" style={{ color: 'var(--text-primary)'}}>Hard</th>
                                        <th className="text-center" style={{ color: 'var(--text-primary)'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (<tr key={student._id}>
                                            <td><div className="d-flex align-items-center"><div className={`avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center`} style={{ width: '40px', height: '40px' }}><span className="fw-bold">{student.name.charAt(0)}</span></div><div>
                                                {/* FIX: Added style to make student names visible */}
                                                <p className="fw-semibold mb-0" style={{ color: 'var(--text-primary)'}}>{student.name}</p>
                                                <p className="small mb-0" style={{ color: 'var(--text-secondary)'}}>@{student.username}</p>
                                            </div></div></td>
                                            <td className="text-center" style={{ color: 'var(--text-secondary)'}}>{new Date(student.joinDate).toLocaleDateString()}</td>
                                            <PerformanceCell performance={student.performance?.easy} /><PerformanceCell performance={student.performance?.medium} /><PerformanceCell performance={student.performance?.hard} />
                                            <td className="text-center"><Link to={`/student/${student._id}`} className="btn btn-sm btn-outline-primary"><Eye size={16} className="me-1" /> View</Link></td>
                                        </tr>))
                                    ) : (
                                        <tr><td colSpan="6" className="text-center p-4" style={{ color: 'var(--text-secondary)'}}>No students match your search.</td></tr>
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