

// frontend/src/components/Dashboard.js (UPDATED AND THEME-AWARE)

import React from 'react';
import Confetti from 'react-confetti';
import { Star, Trophy, Heart, Home, Play, Award, BarChart, CheckCircle } from 'lucide-react';
// Note: I removed Lottie and successAnimation imports as they weren't used in the provided code.
// If you use them elsewhere, you can re-add them.

const LevelCard = ({ level, title, description, questions, stars, onStart, isEnabled = true }) => {
    // Determine color based on level for theme-agnostic styling
    const colorVar = level === 'easy' ? 'var(--success-color)' : level === 'medium' ? 'var(--primary-color)' : 'var(--danger-color)';

    return (
        <div className="col-md-4 mb-4">
            <div
                className={`card h-100 text-center shadow-sm rounded-4 border-0 ${isEnabled ? 'hover-scale' : 'opacity-50'}`}
                onClick={isEnabled ? () => onStart(level) : undefined}
                style={{
                    cursor: isEnabled ? 'pointer' : 'not-allowed',
                    backgroundColor: 'var(--background-card)',
                    border: '1px solid var(--border-color)'
                }}
            >
                <div className="card-body p-5">
                    <div className="icon-circle mx-auto mb-3" style={{ backgroundColor: colorVar, color: '#fff' }}>
                        {level === 'hard' ? <Award size={40} /> : <Play size={40} />}
                    </div>
                    <h2 className="h4 fw-bold" style={{ color: colorVar }}>{title}</h2>
                    <p style={{ color: 'var(--text-secondary)' }} className="mb-3">{description}</p>
                    <p className="small mb-3" style={{ color: 'var(--text-secondary)' }}>{questions}</p>
                    <div>
                        {[...Array(stars)].map((_, i) => (
                            <Star key={i} style={{ color: colorVar }} fill={isEnabled ? "currentColor" : "none"} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProgressDisplay = ({ level, performance }) => {
    const safePerformance = performance || { correct: 0, total: 0 };
    const colorVar = level === 'Easy' ? 'var(--success-color)' : level === 'Medium' ? 'var(--primary-color)' : 'var(--danger-color)';
    const percentage = safePerformance.total > 0 ? (safePerformance.correct / safePerformance.total) * 100 : 0;

    return (
        <div className="p-3 rounded-3 text-center" style={{ backgroundColor: 'var(--background-page)' }}>
            <p className="fw-bold" style={{ color: colorVar }}>{level} Questions</p>
            <p className="h4 fw-bold mb-2" style={{ color: colorVar }}>{safePerformance.correct}/{safePerformance.total}</p>
            <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar" role="progressbar" style={{ width: `${percentage}%`, backgroundColor: colorVar }} />
            </div>
        </div>
    );
};

const Dashboard = ({ user, score, hearts, studentPerformance, onStartQuiz, onLogout, isEvaluated, showConfetti, lastQuizResult }) => {

    let recommendation = 'medium';
    if (lastQuizResult) {
        const lastScorePercentage = lastQuizResult.total > 0 ? (lastQuizResult.correct / lastQuizResult.total) * 100 : 0;
        if (lastScorePercentage >= 70) {
            recommendation = lastQuizResult.level === 'easy' ? 'medium' : 'hard';
        } else if (lastScorePercentage < 40) {
            recommendation = lastQuizResult.level === 'hard' ? 'medium' : 'easy';
        } else {
            recommendation = lastQuizResult.level;
        }
    }
    
    // Define recommendation color using our theme variables
    const recommendationColor = recommendation === 'hard' ? 'var(--danger-color)' : recommendation === 'medium' ? 'var(--primary-color)' : 'var(--success-color)';

    return (
        // Use CSS variable for the page background
        <div className="min-vh-100 p-3 p-md-4" style={{ backgroundColor: 'var(--background-page)'}}>
            {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}

            <div className="container-xl">
                {/* Header Card */}
                <div className="card shadow rounded-4 p-3 mb-4" style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--border-color)' }}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <div className="icon-circle me-3" style={{ width: '4rem', height: '4rem', background: 'linear-gradient(45deg, #ffc107, #fd7e14)', color: '#fff' }}><Home size={28} /></div>
                            <div>
                                <h1 className="h4 fw-bold mb-0" style={{ color: 'var(--text-primary)'}}>Hi {user?.name}! 🌟</h1>
                                <p className="mb-0" style={{ color: 'var(--text-secondary)'}}>Ready to learn and play?</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center mt-3 mt-md-0">
                            {/* These badges will need specific styling if you don't have Bootstrap theme support */}
                            <div className="badge p-2 rounded-pill me-2 d-flex align-items-center" style={{ background: 'rgba(220, 53, 69, 0.1)', color: 'var(--danger-color)'}}><Heart className="me-1" size={18} /> <span className="fw-bold fs-6">{hearts}</span></div>
                            <div className="badge p-2 rounded-pill me-3 d-flex align-items-center" style={{ background: 'rgba(255, 193, 7, 0.1)', color: 'var(--warning-color)'}}><Trophy className="me-1" size={18} /> <span className="fw-bold fs-6">{score}</span></div>
                            <button onClick={onLogout} className="btn btn-secondary btn-sm">Logout</button>
                        </div>
                    </div>
                </div>

                {!isEvaluated ? (
                    // Pre-Evaluation View
                    <div className="card shadow-sm rounded-4 p-4 text-center" style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--border-color)' }}>
                        <div className="icon-circle mx-auto mb-3" style={{ background: 'linear-gradient(45deg, #0d6efd, #6f42c1)', color: '#fff' }}><BarChart size={40} /></div>
                        <h2 className="h3 fw-bold" style={{ color: 'var(--text-primary)' }}>First, let's see where you are!</h2>
                        <p className="fs-5 mb-4" style={{ color: 'var(--text-secondary)' }}>Complete the quiz below for your evaluation.</p>
                        <div className="row justify-content-center">
                            <LevelCard level="medium" title="ATTEMPT QUIZ FOR EVALUATION" description="Your performance here will guide your learning path." questions="10 Thinking Questions" stars={5} onStart={onStartQuiz} />
                        </div>
                    </div>
                ) : (
                    // Post-Evaluation View
                    <>
                        {lastQuizResult && (
                            <div className="card shadow-sm rounded-4 p-4 mb-4 text-center" style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--border-color)' }}>
                                <div className="icon-circle mx-auto mb-3" style={{ background: 'linear-gradient(45deg, #198754, #20c997)', color: '#fff' }}><CheckCircle size={40} /></div>
                                <h2 className="h3 fw-bold" style={{ color: 'var(--text-primary)' }}>Quiz Complete!</h2>
                                <p className="fs-5" style={{ color: 'var(--text-secondary)' }}>You scored <strong>{lastQuizResult.correct} out of {lastQuizResult.total}</strong> on the {lastQuizResult.level} quiz.</p>
                                <p className="fs-5 fw-bold" style={{ color: 'var(--text-primary)' }}>Based on your result, we recommend you try the <span style={{ color: recommendationColor }}>{recommendation.toUpperCase()}</span> level next.</p>
                            </div>
                        )}
                        <h3 className="h5 fw-bold mb-3 text-center" style={{ color: 'var(--text-primary)' }}>Choose Your Next Challenge</h3>
                        <div className="row">
                            <LevelCard level="easy" title="EASY PRACTICE" description="Perfect for beginners!" questions="10 Fun Questions" stars={3} onStart={onStartQuiz} isEnabled={recommendation === 'easy'} />
                            <LevelCard level="medium" title="MEDIUM PRACTICE" description="A balanced challenge." questions="10 Thinking Questions" stars={5} onStart={onStartQuiz} isEnabled={recommendation === 'medium'} />
                            <LevelCard level="hard" title="HARD PRACTICE" description="For super learners!" questions="10 Brain Teasers" stars={7} onStart={onStartQuiz} isEnabled={recommendation === 'hard'} />
                        </div>
                    </>
                )}

                {/* Progress Section */}
                <div className="card shadow-sm rounded-4 p-4 mt-4" style={{ backgroundColor: 'var(--background-card)', borderColor: 'var(--border-color)' }}>
                    <h3 className="h5 fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>Your Overall Progress 📊</h3>
                    <div className="row g-3">
                        <div className="col-md-4"><ProgressDisplay level="Easy" performance={studentPerformance?.easy} /></div>
                        <div className="col-md-4"><ProgressDisplay level="Medium" performance={studentPerformance?.medium} /></div>
                        <div className="col-md-4"><ProgressDisplay level="Hard" performance={studentPerformance?.hard} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;