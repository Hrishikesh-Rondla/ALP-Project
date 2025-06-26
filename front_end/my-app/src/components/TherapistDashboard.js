import React, { useState, useEffect } from 'react';
import api from '../api';
import { User, BarChart2, Calendar, Users } from 'lucide-react';

const TherapistDashboard = ({ user, onLogout }) => {
    const [studentData, setStudentData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentPerformance = async () => {
            try {
                const res = await api.get('/users/student-performance');
                setStudentData(res.data);
            } catch (err) {
                console.error("Failed to fetch student performance data:", err);
                alert("Could not load student data. You may not be authorized.");
            } finally {
                setLoading(false);
            }
        };
        fetchStudentPerformance();
    }, []);

    const calculateOverallPerformance = (results) => {
        const performance = {
            easy: { correct: 0, total: 0 },
            medium: { correct: 0, total: 0 },
            hard: { correct: 0, total: 0 }
        };
        results.forEach(result => {
            if (performance[result.level]) {
                performance[result.level].correct += result.correctAnswers;
                performance[result.level].total += result.totalQuestions;
            }
        });
        return performance;
    };

    if (loading) {
        return <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light"><h2>Loading Student Data...</h2></div>;
    }

    return (
        <div className="min-vh-100 bg-light p-3 p-md-4">
            <div className="container-xl">
                <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white shadow-sm rounded-4">
                    <div>
                        <h1 className="h3 fw-bold text-dark mb-0">Therapist Dashboard</h1>
                        <p className="text-muted mb-0">Overview of all student progress.</p>
                    </div>
                    <div>
                        <span className="me-3 d-none d-md-inline">Welcome, <strong>{user?.name}</strong></span>
                        <button onClick={onLogout} className="btn btn-secondary btn-sm">Logout</button>
                    </div>
                </div>

                <div className="row g-4">
                    {studentData.length > 0 ? studentData.map(student => {
                        const overall = calculateOverallPerformance(student.results);
                        return (
                            <div key={student._id} className="col-lg-6">
                                <div className="card shadow-sm rounded-4 h-100 border-0">
                                    <div className="card-header bg-white p-3 border-0">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-circle bg-gradient-blue-indigo me-3" style={{ width: '3rem', height: '3rem' }}><User size={20} /></div>
                                            <div>
                                                <h4 className="h6 fw-bold mb-0">{student.name}</h4>
                                                <p className="small text-muted mb-0">@{student.username}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body p-4">
                                        <h5 className="small text-muted mb-3 fw-bold">OVERALL PERFORMANCE</h5>
                                        <div className="d-flex justify-content-around text-center mb-4">
                                            <div>
                                                <p className="fw-bold text-success mb-0">{overall.easy.correct}/{overall.easy.total}</p>
                                                <small className="text-muted">Easy</small>
                                            </div>
                                            <div>
                                                <p className="fw-bold text-primary mb-0">{overall.medium.correct}/{overall.medium.total}</p>
                                                <small className="text-muted">Medium</small>
                                            </div>
                                            <div>
                                                <p className="fw-bold text-danger mb-0">{overall.hard.correct}/{overall.hard.total}</p>
                                                <small className="text-muted">Hard</small>
                                            </div>
                                        </div>

                                        <h5 className="small text-muted mb-3 fw-bold">RECENT ACTIVITY</h5>
                                        <ul className="list-group list-group-flush">
                                            {student.results.length > 0 ? student.results.slice(0, 3).map(result => (
                                                <li key={result._id} className="list-group-item d-flex justify-content-between align-items-center small p-2">
                                                    <span>
                                                        <BarChart2 size={14} className={`me-2 text-${result.level === 'easy' ? 'success' : result.level === 'medium' ? 'primary' : 'danger'}`} />
                                                        Level: <strong>{result.level.toUpperCase()}</strong> - Scored {result.score}
                                                    </span>
                                                    <span className="text-muted"><Calendar size={14} className="me-1" />{new Date(result.createdAt).toLocaleDateString()}</span>
                                                </li>
                                            )) : (<li className="list-group-item text-center text-muted small p-2">No quiz data recorded yet.</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : (
                        <div className="col-12">
                            <div className="text-center p-5 bg-white rounded-4 shadow-sm">
                                <Users size={48} className="text-muted mb-3" />
                                <h4 className="fw-bold">No Students Found</h4>
                                <p className="text-muted">There are currently no students registered to display.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TherapistDashboard;