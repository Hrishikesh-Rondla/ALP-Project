// // import React, { useState, useEffect } from 'react';
// // import { Heart, Trophy, Camera, CameraOff } from 'lucide-react';
// // import FacialEmotionTracker from './FacialEmotionTracker';

// // const QuizPage = ({ quizData, currentQuiz, onQuizEnd, onAnswer, score, hearts }) => {
// //     const [questionIndex, setQuestionIndex] = useState(0);
// //     const [selectedAnswer, setSelectedAnswer] = useState(null);
// //     const [showResult, setShowResult] = useState(false);
// //     const [cameraPermission, setCameraPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
// //     const currentQuestion = quizData[currentQuiz][questionIndex];

// //     // Request camera permission when component mounts
// //     useEffect(() => {
// //         if (cameraPermission === 'prompt') {
// //             // This would typically be in a modal
// //             const userChoice = window.confirm("Allow camera access for emotion tracking during the quiz?");
// //             if (userChoice) {
// //                 navigator.mediaDevices.getUserMedia({ video: true })
// //                     .then(() => setCameraPermission('granted'))
// //                     .catch(() => setCameraPermission('denied'));
// //             } else {
// //                 setCameraPermission('denied');
// //             }
// //         }
// //     }, [cameraPermission]);

// //     const handleSelectAnswer = (selectedIndex) => {
// //         setSelectedAnswer(selectedIndex);
// //         setShowResult(true);
// //         const isCorrect = selectedIndex === currentQuestion.correct;
// //         onAnswer(isCorrect, currentQuiz);
// //     };

// //     useEffect(() => {
// //         if (showResult) {
// //             const timer = setTimeout(() => {
// //                 const isLastQuestion = questionIndex >= quizData[currentQuiz].length - 1;
// //                 if (isLastQuestion) {
// //                     onQuizEnd();
// //                 } else {
// //                     setQuestionIndex(prev => prev + 1);
// //                     setSelectedAnswer(null);
// //                     setShowResult(false);
// //                 }
// //             }, 2000);
// //             return () => clearTimeout(timer);
// //         }
// //     }, [showResult, onQuizEnd, questionIndex, quizData, currentQuiz]);

// //     const getButtonClass = (index) => {
// //         if (!showResult) return 'btn btn-outline-primary';
// //         if (index === currentQuestion.correct) return 'btn btn-success';
// //         if (index === selectedAnswer) return 'btn btn-danger';
// //         return 'btn btn-outline-secondary disabled';
// //     };

// //     const getLevelBadgeClass = () => {
// //         if (currentQuiz === 'easy') return 'bg-success-subtle text-success-emphasis';
// //         if (currentQuiz === 'medium') return 'bg-primary-subtle text-primary-emphasis'; // Changed medium to primary for consistency
// //         return 'bg-danger-subtle text-danger-emphasis';
// //     };

// //     const progressPercentage = ((questionIndex + 1) / quizData[currentQuiz].length) * 100;

// //     return (
// //         <div className="min-vh-100 bg-gradient-page-quiz p-3 p-md-4 d-flex flex-column">
// //             <div className="container-xl">
// //                 <div className="card shadow rounded-4 p-3 mb-4">
// //                     <div className="d-flex justify-content-between align-items-center">
// //                         <button onClick={onQuizEnd} className="btn btn-secondary fw-bold">← Back</button>
// //                         <div className="d-flex align-items-center">
// //                             <div className="badge bg-light-red text-danger-emphasis p-2 rounded-pill me-2 d-flex align-items-center"><Heart className="me-1" size={18} /> <span className="fw-bold fs-6">{hearts}</span></div>
// //                             <div className="badge bg-light-yellow text-warning-emphasis p-2 rounded-pill d-flex align-items-center"><Trophy className="me-1" size={18} /> <span className="fw-bold fs-6">{score}</span></div>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 <div className="card shadow-lg rounded-4 p-4 p-md-5">
// //                     <div className="text-center mb-4">
// //                         <div className="badge bg-primary-subtle text-primary-emphasis rounded-pill px-3 py-2 mb-3"><span className="fw-bold">Question {questionIndex + 1} of {quizData[currentQuiz].length}</span></div>
// //                         <div className="mb-3"><span className={`badge rounded-pill px-3 py-2 fw-bold ${getLevelBadgeClass()}`}>{currentQuiz.toUpperCase()} LEVEL</span></div>
// //                         <h2 className="h3 fw-bold text-dark">{currentQuestion.question}</h2>
// //                     </div>
// //                     <div className="row g-3">
// //                         {currentQuestion.options.map((option, index) => (
// //                             <div key={index} className="col-md-6">
// //                                 <button onClick={() => handleSelectAnswer(index)} disabled={showResult} className={`w-100 p-3 rounded-3 fs-5 fw-bold ${getButtonClass(index)}`}>{option}</button>
// //                             </div>
// //                         ))}
// //                     </div>
// //                     {showResult && (
// //                         <div className="mt-4 text-center">
// //                             {selectedAnswer === currentQuestion.correct ? <div className="alert alert-success"><p className="fw-bold h5 mb-0">🎉 Correct! Well done!</p></div> : <div className="alert alert-danger"><p className="fw-bold h5">Not quite right. Keep trying!</p><p className="mb-0">Correct answer: {currentQuestion.options[currentQuestion.correct]}</p></div>}
// //                         </div>
// //                     )}
// //                     <div className="mt-5">
// //                         <div className="progress" style={{ height: '1rem' }}><div className="progress-bar bg-primary" role="progressbar" style={{ width: `${progressPercentage}%` }} /></div>
// //                         <p className="text-center text-muted mt-2 small">Progress: {questionIndex + 1}/{quizData[currentQuiz].length}</p>
// //                     </div>
// //                 </div>
// //             </div>
// //             {/* Render Webcam Component if permission is granted */}
// //             {cameraPermission === 'granted' && <FacialEmotionTracker />}
// //             {cameraPermission === 'denied' && (
// //                 <div className="position-fixed bottom-0 end-0 m-3 p-2 bg-dark text-white rounded-3 shadow-lg d-flex align-items-center"><CameraOff size={18} className="me-2" /> Camera off.</div>
// //             )}
// //         </div>
// //     );
// // };

// // export default QuizPage;

// // src/components/QuizPage.js (Updated)

// import React, { useState, useEffect } from 'react';
// import { Heart, Trophy, CameraOff } from 'lucide-react';
// import FacialEmotionTracker from './FacialEmotionTracker';

// // --- Accept the new props: currentEmotion and onEmotionChange ---
// const QuizPage = ({ quizData, currentQuiz, onQuizEnd, onAnswer, score, hearts, currentEmotion, onEmotionChange }) => {
//     const [questionIndex, setQuestionIndex] = useState(0);
//     const [selectedAnswer, setSelectedAnswer] = useState(null);
//     const [showResult, setShowResult] = useState(false);
//     const [isCameraAllowed, setIsCameraAllowed] = useState(null); // Use null for initial state

//     const currentQuestion = quizData[currentQuiz][questionIndex];

//     // Check for camera permission when the component mounts
//     useEffect(() => {
//         navigator.mediaDevices.getUserMedia({ video: true })
//             .then(() => setIsCameraAllowed(true))
//             .catch(() => setIsCameraAllowed(false));
//     }, []); // Empty dependency array makes this run only once

//     const handleSelectAnswer = (selectedIndex) => {
//         setSelectedAnswer(selectedIndex);
//         setShowResult(true);
//         const isCorrect = selectedIndex === currentQuestion.correct;
//         // The onAnswer function from App.js already knows the current emotion,
//         // so we don't need to pass it from here.
//         onAnswer(isCorrect, currentQuiz);
//     };

//     useEffect(() => {
//         if (showResult) {
//             const timer = setTimeout(() => {
//                 const isLastQuestion = questionIndex >= quizData[currentQuiz].length - 1;
//                 if (isLastQuestion) {
//                     onQuizEnd();
//                 } else {
//                     setQuestionIndex(prev => prev + 1);
//                     setSelectedAnswer(null);
//                     setShowResult(false);
//                 }
//             }, 2000);
//             return () => clearTimeout(timer);
//         }
//     }, [showResult, onQuizEnd, questionIndex, quizData, currentQuiz]);

//     const getButtonClass = (index) => {
//         if (!showResult) return 'btn btn-outline-primary hover-scale';
//         if (index === currentQuestion.correct) return 'btn btn-success';
//         if (index === selectedAnswer) return 'btn btn-danger';
//         return 'btn btn-outline-secondary disabled';
//     };

//     const getLevelBadgeClass = () => {
//         if (currentQuiz === 'easy') return 'bg-success-subtle text-success-emphasis';
//         if (currentQuiz === 'medium') return 'bg-primary-subtle text-primary-emphasis';
//         return 'bg-danger-subtle text-danger-emphasis';
//     };

//     const progressPercentage = ((questionIndex + 1) / quizData[currentQuiz].length) * 100;

//     return (
//         <div className="min-vh-100 bg-gradient-page-quiz p-3 p-md-4 d-flex flex-column">
//             <div className="container-xl">
//                 <div className="card shadow rounded-4 p-3 mb-4">
//                     <div className="d-flex justify-content-between align-items-center">
//                         <button onClick={onQuizEnd} className="btn btn-secondary fw-bold">← Back</button>
//                         <div className="d-flex align-items-center">
//                             <div className="badge bg-light-red text-danger-emphasis p-2 rounded-pill me-2 d-flex align-items-center"><Heart className="me-1" size={18} /> <span className="fw-bold fs-6">{hearts}</span></div>
//                             <div className="badge bg-light-yellow text-warning-emphasis p-2 rounded-pill d-flex align-items-center"><Trophy className="me-1" size={18} /> <span className="fw-bold fs-6">{score}</span></div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="card shadow-lg rounded-4 p-4 p-md-5">
//                     <div className="text-center mb-4">
//                         <div className="badge bg-primary-subtle text-primary-emphasis rounded-pill px-3 py-2 mb-3"><span className="fw-bold">Question {questionIndex + 1} of {quizData[currentQuiz].length}</span></div>
//                         <div className="mb-3"><span className={`badge rounded-pill px-3 py-2 fw-bold ${getLevelBadgeClass()}`}>{currentQuiz.toUpperCase()} LEVEL</span></div>
//                         <h2 className="h3 fw-bold text-dark">{currentQuestion.question}</h2>
//                     </div>
//                     <div className="row g-3">
//                         {currentQuestion.options.map((option, index) => (
//                             <div key={index} className="col-md-6">
//                                 <button onClick={() => handleSelectAnswer(index)} disabled={showResult} className={`w-100 p-3 rounded-3 fs-5 fw-bold ${getButtonClass(index)}`}>{option}</button>
//                             </div>
//                         ))}
//                     </div>
//                     {showResult && (
//                         <div className="mt-4 text-center">
//                             {selectedAnswer === currentQuestion.correct ? <div className="alert alert-success"><p className="fw-bold h5 mb-0">🎉 Correct! Well done!</p></div> : <div className="alert alert-danger"><p className="fw-bold h5">Not quite right. Keep trying!</p><p className="mb-0">Correct answer: {currentQuestion.options[currentQuestion.correct]}</p></div>}
//                         </div>
//                     )}
//                     <div className="mt-5">
//                         <div className="progress" style={{ height: '1rem' }}><div className="progress-bar bg-primary" role="progressbar" style={{ width: `${progressPercentage}%` }} /></div>
//                         <p className="text-center text-muted mt-2 small">Progress: {questionIndex + 1}/{quizData[currentQuiz].length}</p>
//                     </div>
//                 </div>
//             </div>

//             {/* --- UPDATED: Conditionally render based on camera permission --- */}
//             {isCameraAllowed === true && (
//                 <FacialEmotionTracker
//                     currentEmotion={currentEmotion}
//                     onEmotionChange={onEmotionChange}
//                 />
//             )}
//             {isCameraAllowed === false && (
//                 <div className="position-fixed bottom-0 end-0 m-3 p-2 bg-dark text-white rounded-3 shadow-lg d-flex align-items-center"><CameraOff size={18} className="me-2" /> Camera off.</div>
//             )}
//         </div>
//     );
// };

// export default QuizPage;

// src/components/QuizPage.js (Corrected for Simpler Props)

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom'; // Import useParams to get level from URL
// import { Heart, Trophy, CameraOff } from 'lucide-react';
// import FacialEmotionTracker from './FacialEmotionTracker';

// const QuizPage = ({ questions, onQuizEnd, onAnswer, score, hearts, currentEmotion, onEmotionChange }) => {
//     const { level } = useParams(); // Get the current quiz level ('easy', 'medium', etc.) from the URL
//     const [questionIndex, setQuestionIndex] = useState(0);
//     const [selectedAnswer, setSelectedAnswer] = useState(null);
//     const [showResult, setShowResult] = useState(false);
//     const [isCameraAllowed, setIsCameraAllowed] = useState(null);

//     // --- Defensive Check: Handle case where questions are not loaded yet ---
//     if (!questions || questions.length === 0) {
//         return <div>No questions found for this level. Please go back.</div>;
//     }

//     const currentQuestion = questions[questionIndex];

//     useEffect(() => {
//         navigator.mediaDevices.getUserMedia({ video: true })
//             .then(() => setIsCameraAllowed(true))
//             .catch(() => setIsCameraAllowed(false));
//     }, []);

//     const handleSelectAnswer = (selectedIndex) => {
//         setSelectedAnswer(selectedIndex);
//         setShowResult(true);
//         const isCorrect = selectedIndex === currentQuestion.correct;
//         // Pass the level we got from the URL
//         onAnswer(isCorrect, level); 
//     };

//     useEffect(() => {
//         if (showResult) {
//             const timer = setTimeout(() => {
//                 const isLastQuestion = questionIndex >= questions.length - 1;
//                 if (isLastQuestion) {
//                     onQuizEnd();
//                 } else {
//                     setQuestionIndex(prev => prev + 1);
//                     setSelectedAnswer(null);
//                     setShowResult(false);
//                 }
//             }, 2000);
//             return () => clearTimeout(timer);
//         }
//     }, [showResult, onQuizEnd, questionIndex, questions.length]);

//     const getButtonClass = (index) => {
//         if (!showResult) return 'btn btn-outline-primary hover-scale';
//         if (index === currentQuestion.correct) return 'btn btn-success';
//         if (index === selectedAnswer) return 'btn btn-danger';
//         return 'btn btn-outline-secondary disabled';
//     };

//     const getLevelBadgeClass = () => {
//         if (level === 'easy') return 'bg-success-subtle text-success-emphasis';
//         if (level === 'medium') return 'bg-primary-subtle text-primary-emphasis';
//         return 'bg-danger-subtle text-danger-emphasis';
//     };

//     const progressPercentage = ((questionIndex + 1) / questions.length) * 100;

//     return (
//         <div className="min-vh-100 bg-gradient-page-quiz p-3 p-md-4 d-flex flex-column">
//             <div className="container-xl">
//                 {/* ... Card with Back button and stats remains the same ... */}
//                 <div className="card shadow rounded-4 p-3 mb-4">
//                     {/* ... */}
//                 </div>

//                 <div className="card shadow-lg rounded-4 p-4 p-md-5">
//                     <div className="text-center mb-4">
//                         <div className="badge bg-primary-subtle text-primary-emphasis rounded-pill px-3 py-2 mb-3"><span className="fw-bold">Question {questionIndex + 1} of {questions.length}</span></div>
//                         <div className="mb-3"><span className={`badge rounded-pill px-3 py-2 fw-bold ${getLevelBadgeClass()}`}>{level.toUpperCase()} LEVEL</span></div>
//                         <h2 className="h3 fw-bold text-dark">{currentQuestion.question}</h2>
//                     </div>
//                     {/* ... rest of the JSX remains the same ... */}
//                     <div className="row g-3">
//                         {currentQuestion.options.map((option, index) => (
//                             <div key={index} className="col-md-6">
//                                 <button onClick={() => handleSelectAnswer(index)} disabled={showResult} className={`w-100 p-3 rounded-3 fs-5 fw-bold ${getButtonClass(index)}`}>{option}</button>
//                             </div>
//                         ))}
//                     </div>
//                      {/* ... rest of the JSX remains the same ... */}
//                 </div>
//             </div>
//             {isCameraAllowed === true && (
//                 <FacialEmotionTracker
//                     currentEmotion={currentEmotion}
//                     onEmotionChange={onEmotionChange}
//                 />
//             )}
//             {/* ... */}
//         </div>
//     );
// };

// src/components/QuizPage.js (Corrected)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Trophy, CameraOff } from 'lucide-react';
import FacialEmotionTracker from './FacialEmotionTracker';

const QuizPage = ({ questions, onQuizEnd, onAnswer, score, hearts, currentEmotion, onEmotionChange }) => {
    const { level } = useParams();
    const navigate = useNavigate(); // Use navigate for programmatic navigation

    // --- ALL HOOKS ARE NOW AT THE TOP LEVEL ---
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCameraAllowed, setIsCameraAllowed] = useState(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => setIsCameraAllowed(true))
            .catch(() => setIsCameraAllowed(false));
    }, []);

    useEffect(() => {
        if (showResult) {
            const timer = setTimeout(() => {
                if (!questions || questionIndex >= questions.length - 1) {
                    onQuizEnd();
                } else {
                    setQuestionIndex(prev => prev + 1);
                    setSelectedAnswer(null);
                    setShowResult(false);
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showResult, onQuizEnd, questionIndex, questions]);


    // --- MOVED THE DEFENSIVE CHECK HERE ---
    if (!questions || questions.length === 0) {
        return (
            <div className="p-5 text-center">
                <h2>Quiz questions not loaded.</h2>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-3">
                    Go Back to Dashboard
                </button>
            </div>
        );
    }

    const currentQuestion = questions[questionIndex];

    const handleSelectAnswer = (selectedIndex) => {
        setSelectedAnswer(selectedIndex);
        setShowResult(true);
        const isCorrect = selectedIndex === currentQuestion.correct;
        onAnswer(isCorrect, level); 
    };

    const getButtonClass = (index) => {
        if (!showResult) return 'btn btn-outline-primary hover-scale';
        if (index === currentQuestion.correct) return 'btn btn-success';
        if (index === selectedAnswer) return 'btn btn-danger';
        return 'btn btn-outline-secondary disabled';
    };

    const getLevelBadgeClass = () => {
        if (level === 'easy') return 'bg-success-subtle text-success-emphasis';
        if (level === 'medium') return 'bg-primary-subtle text-primary-emphasis';
        return 'bg-danger-subtle text-danger-emphasis';
    };

    const progressPercentage = ((questionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-vh-100 bg-gradient-page-quiz p-3 p-md-4 d-flex flex-column">
            <div className="container-xl">
                <div className="card shadow rounded-4 p-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <button onClick={onQuizEnd} className="btn btn-secondary fw-bold">← Back</button>
                        <div className="d-flex align-items-center">
                            <div className="badge bg-light-red text-danger-emphasis p-2 rounded-pill me-2 d-flex align-items-center"><Heart className="me-1" size={18} /> <span className="fw-bold fs-6">{hearts}</span></div>
                            <div className="badge bg-light-yellow text-warning-emphasis p-2 rounded-pill d-flex align-items-center"><Trophy className="me-1" size={18} /> <span className="fw-bold fs-6">{score}</span></div>
                        </div>
                    </div>
                </div>

                <div className="card shadow-lg rounded-4 p-4 p-md-5">
                    <div className="text-center mb-4">
                        <div className="badge bg-primary-subtle text-primary-emphasis rounded-pill px-3 py-2 mb-3"><span className="fw-bold">Question {questionIndex + 1} of {questions.length}</span></div>
                        <div className="mb-3"><span className={`badge rounded-pill px-3 py-2 fw-bold ${getLevelBadgeClass()}`}>{level.toUpperCase()} LEVEL</span></div>
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
            {isCameraAllowed && <FacialEmotionTracker currentEmotion={currentEmotion} onEmotionChange={onEmotionChange} />}
            {isCameraAllowed === false && <div className="position-fixed bottom-0 end-0 m-3 p-2 bg-dark text-white rounded-3 shadow-lg d-flex align-items-center"><CameraOff size={18} className="me-2" /> Camera off.</div>}
        </div>
    );
};

// Ensure this line exists at the end of the file
export default QuizPage;