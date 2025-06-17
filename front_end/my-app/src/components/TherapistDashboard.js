import React from 'react';
import { BarChart3, Users, Eye, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

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

const PerformanceCell = ({ performance, color }) => (
    <td className="text-center align-middle">
        <div className="d-flex align-items-center justify-content-center">
            <span className={`fw-semibold text-${color} me-2`}>{performance.percentage}%</span>
            <span className={`badge bg-${color}-subtle text-${color}-emphasis small`}>{performance.improvement}</span>
        </div>
        <div className="progress mx-auto mt-1" style={{ height: '6px', width: '80px' }}>
            <div className={`progress-bar bg-${color}`} style={{ width: `${performance.percentage}%` }}></div>
        </div>
        <p className="small text-muted mb-0 mt-1">{performance.correct}/{performance.total}</p>
    </td>
);

const TherapistDashboard = ({ user, studentsData, onLogout }) => (
    <div className="min-vh-100 bg-gradient-page-therapist p-3 p-lg-4">
        <div className="container-fluid">
            {/* Header */}
            <div className="card shadow-sm rounded-4 p-3 mb-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <div className="icon-circle bg-gradient-blue-indigo me-3" style={{ width: '4rem', height: '4rem' }}>
                            <BarChart3 size={28} />
                        </div>
                        <div>
                            <h1 className="h4 fw-bold text-dark mb-0">Therapist Dashboard</h1>
                            <p className="text-muted mb-0">Welcome back, {user?.name}</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="btn btn-danger mt-2 mt-md-0">
                        Logout
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="row">
                <StatCard title="Total Students" value={studentsData.length} icon={Users} color="primary" />
                <StatCard title="Active Sessions" value="54" icon={Calendar} color="success" />
                <StatCard title="Avg Progress" value="76%" icon={TrendingUp} color="info" />
                <StatCard title="Completed" value="342" icon={CheckCircle} color="warning" />
            </div>

            {/* Student Performance Table */}
            <div className="card shadow-sm rounded-4 mt-2">
                <div className="card-header bg-white border-0 pt-3">
                    <h2 className="h5 fw-bold text-dark">Student Performance Overview</h2>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th className="fw-semibold text-muted">Student</th>
                                    <th className="text-center fw-semibold text-muted">Age</th>
                                    <th className="text-center fw-semibold text-muted">Sessions</th>
                                    <th className="text-center fw-semibold text-muted">Easy</th>
                                    <th className="text-center fw-semibold text-muted">Medium</th>
                                    <th className="text-center fw-semibold text-muted">Hard</th>
                                    <th className="text-center fw-semibold text-muted">Streak</th>
                                    <th className="text-center fw-semibold text-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentsData.map((student) => (
                                    <tr key={student.id}>
                                        <td className="align-middle">
                                            <div className="d-flex align-items-center">
                                                <div className="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                    <span className="fw-bold">{student.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="fw-semibold text-dark mb-0">{student.name}</p>
                                                    <p className="small text-muted mb-0">Joined {new Date(student.joinDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center align-middle">
                                            <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">{student.age} years</span>
                                        </td>
                                        <td className="text-center fw-semibold align-middle">{student.totalSessions}</td>
                                        <PerformanceCell performance={student.performance.easy} color="success" />
                                        <PerformanceCell performance={student.performance.medium} color="warning" />
                                        <PerformanceCell performance={student.performance.hard} color="danger" />
                                        <td className="text-center align-middle">
                                            <span className="fw-bold text-warning">{student.streakDays} 🔥</span>
                                        </td>

                                        <td className="text-center align-middle">
                                            <button className="btn btn-sm btn-outline-primary">
                                                <Eye size={16} className="me-1" /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default TherapistDashboard;