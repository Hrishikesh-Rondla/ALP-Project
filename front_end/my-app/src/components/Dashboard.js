import React from 'react';
import { Star, Trophy, Heart, Home, Play, Award, CheckCircle, BarChart, RefreshCw } from 'lucide-react';

// --- SUB-COMPONENTS ---
const LevelCard = ({ level, title, description, questions, stars, color, onStart, isEnabled = true }) => (
    <div className="col-md-4 mb-4">
        <div
            className={`card h-100 text-center shadow-sm rounded-4 border-0 ${isEnabled ? 'hover-scale' : 'opacity-75'}`}
            onClick={isEnabled ? () => onStart(level) : undefined}
            style={{ cursor: isEnabled ? 'pointer' : 'not-allowed', transition: 'all 0.2s ease-in-out' }}
        >
            <div className="card-body p-5">
                <div className={`icon-circle bg-gradient-${color}-light text-white mx-auto mb-3`}>
                    {title.includes('RE-ATTEMPT') ? <RefreshCw size={40} /> : level === 'hard' ? <Award size={40} /> : <Play size={40} />}
                </div>
                <h2 className={`h4 fw-bold text-${color}`}>{title}</h2>
                <p className="text-muted mb-3">{description}</p>
                <p className="small text-muted mb-3">{questions}</p>
                <div>
                    {[...Array(stars)].map((_, i) => (
                        <Star key={i} className={`text-${color}`} fill={isEnabled ? "currentColor" : "none"} />
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
            <div className={`progress-bar bg-${color}`} role="progressbar" style={{ width: `${performance.total ? (performance.correct / performance.total) * 100 : 0}%` }} />
        </div>
    </div>
);

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = ({ user, score, hearts, studentPerformance, onStartQuiz, onLogout, isEvaluated }) => {
    const mediumPerformance = studentPerformance.medium;
    const evaluationPercentage = mediumPerformance.total > 0 ? (mediumPerformance.correct / mediumPerformance.total) * 100 : 0;

    let recommendation = {
        level: 'medium',
        text: 'Try the Medium level again to solidify your knowledge.',
        color: 'primary'
    };
    if (evaluationPercentage <= 40) {
        recommendation = { level: 'easy', text: 'You should practice the Easy level to build your fundamentals.', color: 'success' };
    } else if (evaluationPercentage > 70) {
        recommendation = { level: 'hard', text: 'Excellent work! You are ready for the Hard level challenge.', color: 'danger' };
    }

    return (
        <div className="min-vh-100 bg-gradient-page-dashboard p-3 p-md-4">
            <div className="container-xl">
                <div className="card shadow rounded-4 p-3 mb-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <div className="icon-circle bg-gradient-yellow-orange me-3" style={{ width: '4rem', height: '4rem' }}><Home size={28} /></div>
                            <div>
                                <h1 className="h4 fw-bold text-dark mb-0">Hi {user?.name}! 🌟</h1>
                                <p className="text-muted mb-0">Ready to learn and play?</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center mt-3 mt-md-0">
                            <div className="badge bg-light-red text-danger-emphasis p-2 rounded-pill me-2 d-flex align-items-center"><Heart className="me-1" size={18} /> <span className="fw-bold fs-6">{hearts}</span></div>
                            <div className="badge bg-light-yellow text-warning-emphasis p-2 rounded-pill me-3 d-flex align-items-center"><Trophy className="me-1" size={18} /> <span className="fw-bold fs-6">{score}</span></div>
                            <button onClick={onLogout} className="btn btn-secondary btn-sm">Logout</button>
                        </div>
                    </div>
                </div>

                {!isEvaluated ? (
                    <div className="card shadow-sm rounded-4 p-4 text-center">
                        <div className="icon-circle bg-gradient-blue-indigo mx-auto mb-3"><BarChart size={40} /></div>
                        <h2 className="h3 fw-bold text-dark">First, let's see where you are!</h2>
                        <p className="text-muted fs-5 mb-4">Complete the quiz below for your evaluation.</p>
                        <div className="row justify-content-center">
                            <LevelCard level="medium" title="ATTEMPT QUIZ FOR EVALUATION" description="Your performance will guide your learning path." questions="10 Questions" stars={5} color="primary" onStart={onStartQuiz} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="card shadow-sm rounded-4 p-4 mb-4 text-center">
                            <div className="icon-circle bg-gradient-green-blue mx-auto mb-3"><CheckCircle size={40} /></div>
                            <h2 className="h3 fw-bold text-dark">Evaluation Complete!</h2>
                            <p className="fs-5 text-muted">You scored <strong>{mediumPerformance.correct} out of {mediumPerformance.total}</strong> on the evaluation quiz.</p>
                            <p className={`fs-5 fw-bold text-${recommendation.color}`}>{recommendation.text}</p>
                        </div>
                        <h3 className="h5 fw-bold text-dark mb-3 text-center">Practice Your Skills</h3>
                        <div className="row">
                            <LevelCard level="easy" title="EASY PRACTICE" description="Build your fundamentals." questions="10 Questions" stars={3} color="success" onStart={onStartQuiz} isEnabled={recommendation.level === 'easy'} />
                            <LevelCard level="medium" title="RE-ATTEMPT" description="Try to beat your score!" questions="10 Questions" stars={5} color="primary" onStart={onStartQuiz} isEnabled={true} />
                            <LevelCard level="hard" title="HARD PRACTICE" description="Challenge yourself!" questions="10 Questions" stars={7} color="danger" onStart={onStartQuiz} isEnabled={recommendation.level === 'hard'} />
                        </div>
                    </>
                )}

                <div className="card shadow-sm rounded-4 p-4 mt-4">
                    <h3 className="h5 fw-bold text-dark mb-4">Your Progress 📊</h3>
                    <div className="row g-3">
                        <div className="col-md-4"><ProgressDisplay level="Easy" color="success" performance={studentPerformance.easy} /></div>
                        <div className="col-md-4"><ProgressDisplay level="Medium" color="primary" performance={studentPerformance.medium} /></div>
                        <div className="col-md-4"><ProgressDisplay level="Hard" color="danger" performance={studentPerformance.hard} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;