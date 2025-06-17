import React, { useState, useEffect } from 'react';
import { Heart, Trophy } from 'lucide-react';

const QuizPage = ({
    quizData,
    currentQuiz,
    onQuizEnd,
    onAnswer,
    score,
    hearts,
}) => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const currentQuestion = quizData[currentQuiz][questionIndex];

    const handleSelectAnswer = (selectedIndex) => {
        setSelectedAnswer(selectedIndex);
        setShowResult(true);
        const isCorrect = selectedIndex === currentQuestion.correct;
        onAnswer(isCorrect, currentQuiz);
    };

    useEffect(() => {
        if (showResult) {
            const timer = setTimeout(() => {
                const isLastQuestion = questionIndex >= quizData[currentQuiz].length - 1;
                const isCorrect = selectedAnswer === currentQuestion.correct;
                const outOfLives = !isCorrect && hearts <= 1;

                if (isLastQuestion || outOfLives) {
                    onQuizEnd();
                } else {
                    setQuestionIndex(prev => prev + 1);
                    setSelectedAnswer(null);
                    setShowResult(false);
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showResult, onQuizEnd, questionIndex, quizData, currentQuiz.length, hearts, selectedAnswer, currentQuestion.correct]);

    const getButtonClass = (index) => {
        if (!showResult) {
            return 'btn btn-outline-primary';
        }
        if (index === currentQuestion.correct) {
            return 'btn btn-success';
        }
        if (index === selectedAnswer) {
            return 'btn btn-danger';
        }
        return 'btn btn-outline-secondary disabled';
    };

    const getLevelBadgeClass = () => {
        if (currentQuiz === 'easy') return 'bg-success-subtle text-success-emphasis';
        if (currentQuiz === 'medium') return 'bg-warning-subtle text-warning-emphasis';
        return 'bg-danger-subtle text-danger-emphasis';
    };

    const progressPercentage = ((questionIndex + 1) / quizData[currentQuiz].length) * 100;

    return (
        <div className="min-vh-100 bg-gradient-page-quiz p-3 p-md-4 d-flex flex-column">
            <div className="container-xl">
                {/* Quiz Header */}
                <div className="card shadow rounded-4 p-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <button onClick={onQuizEnd} className="btn btn-secondary fw-bold">← Back</button>
                        <div className="d-flex align-items-center">
                            <div className="badge bg-light-red text-danger-emphasis p-2 rounded-pill me-2 d-flex align-items-center">
                                <Heart className="me-1" size={18} />
                                <span className="fw-bold fs-6">{hearts}</span>
                            </div>
                            <div className="badge bg-light-yellow text-warning-emphasis p-2 rounded-pill d-flex align-items-center">
                                <Trophy className="me-1" size={18} />
                                <span className="fw-bold fs-6">{score}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="card shadow-lg rounded-4 p-4 p-md-5">
                    <div className="text-center mb-4">
                        <div className="badge bg-primary-subtle text-primary-emphasis rounded-pill px-3 py-2 mb-3">
                            <span className="fw-bold">
                                Question {questionIndex + 1} of {quizData[currentQuiz].length}
                            </span>
                        </div>
                        <div className="mb-3">
                            <span className={`badge rounded-pill px-3 py-2 fw-bold ${getLevelBadgeClass()}`}>
                                {currentQuiz.toUpperCase()} LEVEL
                            </span>
                        </div>
                        <h2 className="h3 fw-bold text-dark">{currentQuestion.question}</h2>
                    </div>

                    <div className="row g-3">
                        {currentQuestion.options.map((option, index) => (
                            <div key={index} className="col-md-6">
                                <button
                                    onClick={() => handleSelectAnswer(index)}
                                    disabled={showResult}
                                    className={`w-100 p-3 rounded-3 fs-5 fw-bold ${getButtonClass(index)}`}
                                >
                                    {option}
                                </button>
                            </div>
                        ))}
                    </div>

                    {showResult && (
                        <div className="mt-4 text-center">
                            {selectedAnswer === currentQuestion.correct ? (
                                <div className="alert alert-success">
                                    <p className="fw-bold h5 mb-0">🎉 Correct! Well done!</p>
                                </div>
                            ) : (
                                <div className="alert alert-danger">
                                    <p className="fw-bold h5">Not quite right. Keep trying!</p>
                                    <p className="mb-0">Correct answer: {currentQuestion.options[currentQuestion.correct]}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-5">
                        <div className="progress" style={{ height: '1rem' }}>
                            <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${progressPercentage}%` }} />
                        </div>
                        <p className="text-center text-muted mt-2 small">
                            Progress: {questionIndex + 1}/{quizData[currentQuiz].length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;