import React from 'react';
import { Star, Trophy, Heart, Home, Play, Award } from 'lucide-react';

const LevelCard = ({ level, title, description, questions, stars, color, onStart }) => (
    <div className="col-md-4 mb-4">
        <div className="card h-100 text-center shadow-sm rounded-4 border-0 hover-scale" onClick={() => onStart(level)} style={{ cursor: 'pointer' }}>
            <div className="card-body p-5">
                <div className={`icon-circle bg-gradient-${color}-light text-white mx-auto mb-3`}>
                    {level === 'hard' ? <Award size={40} /> : <Play size={40} />}
                </div>
                <h2 className={`h4 fw-bold text-${color}`}>{title}</h2>
                <p className="text-muted mb-3">{description}</p>
                <p className="small text-muted mb-3">{questions}</p>
                <div>
                    {[...Array(stars)].map((_, i) => (
                        <Star key={i} className={`text-${color}`} fill="currentColor" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const ProgressDisplay = ({ level, color, performance }) => (
    <div className={`bg-light-${color} p-3 rounded-3 text-center`}>
        <p className={`text-${color} fw-bold`}>{level} Questions</p>
        <p className={`h4 fw-bold text-${color} mb-2`}>{performance.correct}/{performance.total}</p>
        <div className="progress" style={{ height: '8px' }}>
            <div
                className={`progress-bar bg-${color}`}
                role="progressbar"
                style={{ width: `${performance.total ? (performance.correct / performance.total) * 100 : 0}%` }}
                aria-valuenow={performance.total ? (performance.correct / performance.total) * 100 : 0}
                aria-valuemin="0"
                aria-valuemax="100"
            ></div>
        </div>
    </div>
);

const Dashboard = ({ user, score, hearts, studentPerformance, onStartQuiz, onLogout }) => (
    <div className="min-vh-100 bg-gradient-page-dashboard p-3 p-md-4">
        <div className="container-xl">
            {/* Header */}
            <div className="card shadow rounded-4 p-3 mb-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <div className="icon-circle bg-gradient-yellow-orange me-3" style={{ width: '4rem', height: '4rem' }}>
                            <Home size={28} />
                        </div>
                        <div>
                            <h1 className="h4 fw-bold text-dark mb-0">Hi {user?.name}! 🌟</h1>
                            <p className="text-muted mb-0">Ready to learn and play?</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-center mt-3 mt-md-0">
                        <div className="badge bg-light-red text-danger-emphasis p-2 rounded-pill me-2 d-flex align-items-center">
                            <Heart className="me-1" size={18} />
                            <span className="fw-bold fs-6">{hearts}</span>
                        </div>
                        <div className="badge bg-light-yellow text-warning-emphasis p-2 rounded-pill me-3 d-flex align-items-center">
                            <Trophy className="me-1" size={18} />
                            <span className="fw-bold fs-6">{score}</span>
                        </div>
                        <button onClick={onLogout} className="btn btn-secondary btn-sm">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Game Levels */}
            <div className="row">
                <LevelCard level="easy" title="EASY" description="Perfect for beginners!" questions="10 Fun Questions" stars={3} color="success" onStart={onStartQuiz} />
                <LevelCard level="medium" title="MEDIUM" description="Ready for a challenge?" questions="10 Thinking Questions" stars={5} color="warning" onStart={onStartQuiz} />
                <LevelCard level="hard" title="HARD" description="For super learners!" questions="10 Brain Teasers" stars={7} color="danger" onStart={onStartQuiz} />
            </div>

            {/* Progress Section */}
            <div className="card shadow-sm rounded-4 p-4 mt-4">
                <h3 className="h5 fw-bold text-dark mb-4">Your Progress 📊</h3>
                <div className="row g-3">
                    <div className="col-md-4">
                        <ProgressDisplay level="Easy" color="success" performance={studentPerformance.easy} />
                    </div>
                    <div className="col-md-4">
                        <ProgressDisplay level="Medium" color="warning" performance={studentPerformance.medium} />
                    </div>
                    <div className="col-md-4">
                        <ProgressDisplay level="Hard" color="danger" performance={studentPerformance.hard} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Dashboard;