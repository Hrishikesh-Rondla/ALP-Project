import React, { useState, useEffect } from 'react';
import { Heart, Trophy, Camera, CameraOff } from 'lucide-react';
import FacialEmotionTracker from './FacialEmotionTracker';
import api from '../api'; // Import the centralized API handler

const QuizPage = ({ currentQuiz, onQuizEnd }) => {
    // Component's internal state
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

    // State for tracking performance during this specific quiz
    const [score, setScore] = useState(0);
    const [hearts, setHearts] = useState(3);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    const [cameraPermission, setCameraPermission] = useState('prompt');

    // Effect to fetch quiz questions from the backend when the component mounts
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quizzes/${currentQuiz}`);
                setQuestions(res.data);
            } catch (err) {
                console.error("Failed to fetch quiz:", err);
                alert("Could not load the quiz. Returning to dashboard.");
                onQuizEnd();
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [currentQuiz, onQuizEnd]);

    // Effect for camera permission
    useEffect(() => {
        if (cameraPermission === 'prompt') {
            const userChoice = window.confirm("Allow camera access for optional emotion tracking?");
            if (userChoice) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(() => setCameraPermission('granted'))
                    .catch(() => setCameraPermission('denied'));
            } else {
                setCameraPermission('denied');
            }
        }
    }, [cameraPermission]);

    const handleSelectAnswer = (selectedIndex) => {
        setSelectedAnswer(selectedIndex);
        setShowResult(true);
        const isCorrect = selectedIndex === questions[questionIndex].correct;

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            const points = currentQuiz === 'easy' ? 10 : currentQuiz === 'medium' ? 20 : 30;
            setScore(prev => prev + points);
        } else {
            setHearts(prev => Math.max(0, prev - 1));
        }
    };

    // New function to submit results to the backend
    const submitResults = async () => {
        try {
            await api.post('/quizzes/submit', {
                level: currentQuiz,
                correctAnswers,
                totalQuestions: questions.length,
                score
            });
        } catch (err) {
            console.error("Failed to submit results:", err);
            alert("There was an error saving your results, but you have completed the quiz.");
        } finally {
            // Ensure we navigate back to the dashboard even if the API call fails
            onQuizEnd();
        }
    };

    // Effect to handle advancing to the next question or ending the quiz
    useEffect(() => {
        if (showResult) {
            const timer = setTimeout(() => {
                const isLastQuestion = questionIndex >= questions.length - 1;
                if (isLastQuestion) {
                    submitResults(); // Call the new submit function
                } else {
                    setQuestionIndex(prev => prev + 1);
                    setSelectedAnswer(null);
                    setShowResult(false);
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showResult, questions, questionIndex]);

    // --- UI HELPER FUNCTIONS (UNCHANGED) ---
    const getButtonClass = (index) => {
        if (!showResult) return 'btn btn-outline-primary';
        const currentQuestion = questions[questionIndex];
        if (index === currentQuestion.correct) return 'btn btn-success';
        if (index === selectedAnswer) return 'btn btn-danger';
        return 'btn btn-outline-secondary disabled';
    };

    const getLevelBadgeClass = () => {
        if (currentQuiz === 'easy') return 'bg-success-subtle text-success-emphasis';
        if (currentQuiz === 'medium') return 'bg-primary-subtle text-primary-emphasis';
        return 'bg-danger-subtle text-danger-emphasis';
    };

    // --- RENDER LOGIC ---
    if (loading) {
        return <div className="min-vh-100 d-flex justify-content-center align-items-center"><h2>Loading Quiz...</h2></div>;
    }

    if (questions.length === 0) {
        return <div className="min-vh-100 d-flex justify-content-center align-items-center"><h2>Could not load quiz questions.</h2></div>;
    }

    const currentQuestion = questions[questionIndex];
    const progressPercentage = ((questionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-vh-100 bg-gradient-page-quiz p-3 p-md-4 d-flex flex-column">
            <div className="container-xl">
                {/* Quiz Header */}
                <div className="card shadow rounded-4 p-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <button onClick={onQuizEnd} className="btn btn-secondary fw-bold">← Back</button>
                        <div className="d-flex align-items-center">
                            <div className="badge bg-light-red text-danger-emphasis p-2 rounded-pill me-2 d-flex align-items-center"><Heart className="me-1" size={18} /> <span className="fw-bold fs-6">{hearts}</span></div>
                            <div className="badge bg-light-yellow text-warning-emphasis p-2 rounded-pill d-flex align-items-center"><Trophy className="me-1" size={18} /> <span className="fw-bold fs-6">{score}</span></div>
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="card shadow-lg rounded-4 p-4 p-md-5">
                    <div className="text-center mb-4">
                        <div className="badge bg-primary-subtle text-primary-emphasis rounded-pill px-3 py-2 mb-3"><span className="fw-bold">Question {questionIndex + 1} of {questions.length}</span></div>
                        <div className="mb-3"><span className={`badge rounded-pill px-3 py-2 fw-bold ${getLevelBadgeClass()}`}>{currentQuiz.toUpperCase()} LEVEL</span></div>
                        <h2 className="h3 fw-bold text-dark">{currentQuestion.question}</h2>
                    </div>

                    <div className="row g-3">
                        {currentQuestion.options.map((option, index) => (
                            <div key={index} className="col-md-6">
                                <button onClick={() => handleSelectAnswer(index)} disabled={showResult} className={`w-100 p-3 rounded-3 fs-5 fw-bold ${getButtonClass(index)}`}>{option}</button>
                            </div>
                        ))}
                    </div>

                    {showResult && (
                        <div className="mt-4 text-center">
                            {selectedAnswer === currentQuestion.correct ? <div className="alert alert-success"><p className="fw-bold h5 mb-0">🎉 Correct! Well done!</p></div> : <div className="alert alert-danger"><p className="fw-bold h5">Not quite right. Keep trying!</p><p className="mb-0">Correct answer: {currentQuestion.options[currentQuestion.correct]}</p></div>}
                        </div>
                    )}

                    <div className="mt-5">
                        <div className="progress" style={{ height: '1rem' }}><div className="progress-bar bg-primary" role="progressbar" style={{ width: `${progressPercentage}%` }} /></div>
                        <p className="text-center text-muted mt-2 small">Progress: {questionIndex + 1}/{questions.length}</p>
                    </div>
                </div>
            </div>

            {/* Webcam Component Logic (Unchanged) */}
            {cameraPermission === 'granted' && <FacialEmotionTracker />}
            {cameraPermission === 'denied' && (
                <div className="position-fixed bottom-0 end-0 m-3 p-2 bg-dark text-white rounded-3 shadow-lg d-flex align-items-center"><CameraOff size={18} className="me-2" /> Camera off.</div>
            )}
        </div>
    );
};

export default QuizPage;