// // frontend/src/components/QuizPage.js

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Heart, Trophy, CameraOff } from 'lucide-react';
// import FacialEmotionTracker from './FacialEmotionTracker';

// const NEXT_QUESTION_DELAY_MS = 1500;

// const QuizPage = ({ questions, onQuizEnd, onAnswer, score, hearts, currentEmotion, onEmotionChange }) => {
//     const { level } = useParams();
//     const navigate = useNavigate();

//     // --- NEW: Internal state to track performance within THIS quiz ---
//     const [correctAnswers, setCorrectAnswers] = useState(0);

//     const [questionIndex, setQuestionIndex] = useState(0);
//     const [selectedAnswer, setSelectedAnswer] = useState(null);
//     const [showResult, setShowResult] = useState(false);
//     const [isCameraAllowed, setIsCameraAllowed] = useState(null);

//     useEffect(() => {
//         navigator.mediaDevices.getUserMedia({ video: true })
//             .then(() => setIsCameraAllowed(true))
//             .catch(() => setIsCameraAllowed(false));
//     }, []);

//     const handleEndQuiz = () => {
//         // --- MODIFIED: Pass a detailed result object back ---
//         onQuizEnd({
//             correct: correctAnswers,
//             total: questions.length,
//             level: level,
//         });
//     };

//     useEffect(() => {
//         if (showResult) {
//             const timer = setTimeout(() => {
//                 if (!questions || questionIndex >= questions.length - 1) {
//                     handleEndQuiz(); // Call our new handler
//                 } else {
//                     setQuestionIndex(prev => prev + 1);
//                     setSelectedAnswer(null);
//                     setShowResult(false);
//                 }
//             }, NEXT_QUESTION_DELAY_MS);

//             return () => clearTimeout(timer);
//         }
//     }, [showResult, questionIndex]);

//     if (!questions || questions.length === 0) {
//         return (
//             <div className="p-5 text-center">
//                 <h2>Quiz questions not loaded.</h2>
//                 <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-3">
//                     Go Back to Dashboard
//                 </button>
//             </div>
//         );
//     }

//     const currentQuestion = questions[questionIndex];

//     const handleSelectAnswer = (selectedIndex) => {
//         if (showResult) return;
//         setSelectedAnswer(selectedIndex);
//         setShowResult(true);
//         const isCorrect = selectedIndex === currentQuestion.correct;

//         // --- MODIFIED: Update internal score and call parent handler ---
//         if (isCorrect) {
//             setCorrectAnswers(prev => prev + 1);
//         }
//         onAnswer(isCorrect, level);
//     };

//     // --- The rest of the component's JSX remains the same ---
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
//                 <div className="card shadow rounded-4 p-3 mb-4">
//                     <div className="d-flex justify-content-between align-items-center">
//                         <button onClick={handleEndQuiz} className="btn btn-secondary fw-bold">← End Quiz</button>
//                         <div className="d-flex align-items-center">
//                             <div className="badge bg-light-yellow text-warning-emphasis p-2 rounded-pill d-flex align-items-center me-2"><Trophy className="me-1" size={18} /> <span className="fw-bold fs-6">{score}</span></div>
//                             <div className="badge bg-light-red text-danger-emphasis p-2 rounded-pill d-flex align-items-center"><Heart className="me-1" size={18} /> <span className="fw-bold fs-6">{hearts}</span></div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="card shadow-lg rounded-4 p-4 p-md-5">
//                     <div className="text-center mb-4">
//                         <div className="badge bg-primary-subtle text-primary-emphasis rounded-pill px-3 py-2 mb-3"><span className="fw-bold">Question {questionIndex + 1} of {questions.length}</span></div>
//                         <div className="mb-3"><span className={`badge rounded-pill px-3 py-2 fw-bold ${getLevelBadgeClass()}`}>{level.toUpperCase()} LEVEL</span></div>
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
//                             {selectedAnswer === currentQuestion.correct ? <div className="alert alert-success"><p className="fw-bold h5 mb-0">🎉 Correct! Well done!</p></div> : <div className="alert alert-danger"><p className="fw-bold h5">Not quite right!</p><p className="mb-0">Correct answer: {currentQuestion.options[currentQuestion.correct]}</p></div>}
//                         </div>
//                     )}
//                     <div className="mt-5">
//                         <div className="progress" style={{ height: '1rem' }}><div className="progress-bar bg-primary" role="progressbar" style={{ width: `${progressPercentage}%` }} /></div>
//                         <p className="text-center text-muted mt-2 small">Progress: {questionIndex + 1}/{questions.length}</p>
//                     </div>
//                 </div>
//             </div>
//             {isCameraAllowed && <FacialEmotionTracker currentEmotion={currentEmotion} onEmotionChange={onEmotionChange} />}
//             {isCameraAllowed === false && <div className="position-fixed bottom-0 end-0 m-3 p-2 bg-dark text-white rounded-3 shadow-lg d-flex align-items-center"><CameraOff size={18} className="me-2" /> Camera off.</div>}
//         </div>
//     );
// };

// export default QuizPage;


// frontend/src/components/QuizPage.js (UPDATED with Intervention Sidebar)

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Heart, Trophy } from 'lucide-react';
// import FacialEmotionTracker from './FacialEmotionTracker';
// import InterventionSidebar from './InterventionSidebar'; // Import our new component

// const NEXT_QUESTION_DELAY_MS = 1500;

// const QuizPage = ({ questions, onQuizEnd, onAnswer, score, hearts, onEmotionChange, showIntervention, closeIntervention }) => {
//     const { level } = useParams();
//     const navigate = useNavigate();
//     const [correctAnswers, setCorrectAnswers] = useState(0);
//     const [questionIndex, setQuestionIndex] = useState(0);
//     const [selectedAnswer, setSelectedAnswer] = useState(null);
//     const [showResult, setShowResult] = useState(false);
    
//     useEffect(() => {
//         let timer;
//         if (showResult && !showIntervention) { // Quiz only advances if not paused
//             timer = setTimeout(() => {
//                 if (questionIndex >= questions.length - 1) {
//                     onQuizEnd({ correct: correctAnswers, total: questions.length, level });
//                 } else {
//                     setQuestionIndex(prev => prev + 1);
//                     setSelectedAnswer(null);
//                     setShowResult(false);
//                 }
//             }, NEXT_QUESTION_DELAY_MS);
//         }
//         return () => clearTimeout(timer);
//     }, [showResult, showIntervention, questions, questionIndex, correctAnswers, level, onQuizEnd]);

//     const handleSelectAnswer = (selectedIndex) => {
//         if (showResult || showIntervention) return;
//         setSelectedAnswer(selectedIndex);
//         setShowResult(true);
//         const isCorrect = selectedIndex === currentQuestion.correct;
//         if (isCorrect) setCorrectAnswers(prev => prev + 1);
//         onAnswer(isCorrect, level);
//     };

//     if (!questions || questions.length === 0 || !questions[questionIndex]) return (<div className="p-5 text-center"><h2>Loading...</h2></div>);

//     const currentQuestion = questions[questionIndex];
//     const getButtonClass = (index) => { if (!showResult) return 'btn btn-outline-primary'; if (index === currentQuestion.correct) return 'btn btn-success'; if (index === selectedAnswer) return 'btn btn-danger'; return 'btn btn-outline-secondary disabled'; };
//     const progressPercentage = ((questionIndex + 1) / questions.length) * 100;

//     return (
//         <div style={{ backgroundColor: 'var(--background-page)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
//             <div style={{ filter: showIntervention ? 'blur(4px)' : 'none', transition: 'filter 0.3s ease-in-out', pointerEvents: showIntervention ? 'none' : 'auto' }} className="p-3 p-md-4 d-flex flex-column">
//                 <div className="container-xl">
//                     <div className="card shadow-sm rounded-4 p-3 mb-4">
//                         <div className="d-flex justify-content-between align-items-center">
//                             <button onClick={() => onQuizEnd({ correct: correctAnswers, total: questions.length, level })} className="btn btn-secondary fw-bold">← End Quiz</button>
//                             <div className="d-flex align-items-center"><div className="badge p-2 rounded-pill me-2" style={{ background: 'rgba(255, 193, 7, 0.1)', color: 'var(--warning-color)'}}><Trophy className="me-1" size={18} /> <span className="fw-bold fs-6">{score}</span></div><div className="badge p-2 rounded-pill" style={{ background: 'rgba(220, 53, 69, 0.1)', color: 'var(--danger-color)'}}><Heart className="me-1" size={18} /> <span className="fw-bold fs-6">{hearts}</span></div></div>
//                         </div>
//                     </div>
//                     <div className="card shadow-lg rounded-4 p-4 p-md-5">
//                         <div className="text-center mb-4">
//                             <h2 className="h3 fw-bold" style={{ color: 'var(--text-primary)' }}>{currentQuestion.question}</h2>
//                         </div>
//                         <div className="row g-3">
//                             {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option, index) => ( <div key={index} className="col-md-6"><button onClick={() => handleSelectAnswer(index)} disabled={showResult || showIntervention} className={`w-100 p-3 rounded-3 fs-5 fw-bold ${getButtonClass(index)}`}>{option}</button></div> ))}
//                         </div>
//                         <div className="mt-5"><div className="progress" style={{ height: '1rem' }}><div className="progress-bar" role="progressbar" style={{ width: `${progressPercentage}%` }} /></div><p className="text-center mt-2 small" style={{ color: 'var(--text-secondary)'}}>Progress: {questionIndex + 1}/{questions.length}</p></div>
//                     </div>
//                 </div>
//             </div>
//             <FacialEmotionTracker onEmotionChange={onEmotionChange} />
//             <InterventionSidebar show={showIntervention} onClose={closeIntervention} />
//         </div>
//     );
// };

// export default QuizPage;

// frontend/src/components/QuizPage.js (DEFINITIVE, STABLE VERSION)

// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Heart, Trophy } from 'lucide-react';
// import FacialEmotionTracker from './FacialEmotionTracker';
// import InterventionSidebar from './InterventionSidebar';

// const NEXT_QUESTION_DELAY_MS = 1500;

// const QuizPage = ({ questions, setQuestions, onQuizEnd, onAnswer, score, hearts, onEmotionChange, showIntervention, closeIntervention }) => {
//     const { level } = useParams();
//     const [questionIndex, setQuestionIndex] = useState(0);
//     const [selectedAnswer, setSelectedAnswer] = useState(null);
//     const [showResult, setShowResult] = useState(false);
//     const [correctAnswers, setCorrectAnswers] = useState(0);

//     useEffect(() => {
//         let timer;
//         if (showResult && !showIntervention) {
//             timer = setTimeout(() => {
//                 if (questionIndex >= questions.length - 1) {
//                     onQuizEnd({ correct: correctAnswers, total: questions.length, level });
//                 } else {
//                     setQuestionIndex(prev => prev + 1);
//                     setSelectedAnswer(null);
//                     setShowResult(false);
//                 }
//             }, NEXT_QUESTION_DELAY_MS);
//         }
//         return () => clearTimeout(timer);
//     }, [showResult, showIntervention, questions.length, questionIndex, correctAnswers, level, onQuizEnd]);

//     const handleSelectAnswer = (selectedIndex) => {
//         if (showResult || showIntervention) return;
//         const currentQuestion = questions[questionIndex];
//         setSelectedAnswer(selectedIndex);
//         setShowResult(true);
//         const isCorrect = selectedIndex === currentQuestion.correct;
//         if (isCorrect) {
//             setCorrectAnswers(prev => prev + 1);
//         }
//         onAnswer(isCorrect, level);
//     };
    
//     const handleGetEasierQuestion = useCallback(async () => {
//         try {
//             const res = await axios.get('http://localhost:5000/api/quizzes/easy-question');
//             const easierQuestion = { ...res.data, isIntervention: true };
//             setQuestions(prevQuestions => {
//                 const newQuestions = [...prevQuestions];
//                 newQuestions.splice(questionIndex + 1, 0, easierQuestion);
//                 return newQuestions;
//             });
//             closeIntervention();
//         } catch (err) {
//             alert("Sorry, couldn't load an easier question.");
//             closeIntervention();
//         }
//     }, [questionIndex, setQuestions, closeIntervention]);

//     if (!questions || questions.length === 0 || !questions[questionIndex]) {
//         return <div className="p-5 text-center"><h2>Loading...</h2></div>;
//     }

//     const currentQuestion = questions[questionIndex];
//     const getButtonClass = (index) => { if (!showResult) return 'btn btn-outline-primary'; if (index === currentQuestion.correct) return 'btn btn-success'; if (index === selectedAnswer) return 'btn btn-danger'; return 'btn btn-outline-secondary disabled'; };
//     const progressPercentage = ((questionIndex + 1) / questions.length) * 100;

//     return (
//         <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
//             <div style={{ filter: showIntervention ? 'blur(4px)' : 'none', transition: 'filter 0.3s ease-in-out', pointerEvents: showIntervention ? 'none' : 'auto' }} className="p-3 p-md-4 d-flex flex-column">
//                 <div className="container-xl">
//                     <div className="card shadow-sm rounded-4 p-3 mb-4"><div className="d-flex justify-content-between align-items-center"><button onClick={() => onQuizEnd({ correct: correctAnswers, total: questions.length, level })} className="btn btn-secondary fw-bold">← End Quiz</button><div className="d-flex align-items-center"><div className="badge p-2 rounded-pill me-2" style={{ background: 'rgba(255, 193, 7, 0.1)', color: 'var(--warning-color)'}}><Trophy className="me-1" size={18} /> <span className="fw-bold fs-6">{score}</span></div><div className="badge p-2 rounded-pill" style={{ background: 'rgba(220, 53, 69, 0.1)', color: 'var(--danger-color)'}}><Heart className="me-1" size={18} /> <span className="fw-bold fs-6">{hearts}</span></div></div></div></div>
//                     <div className="card shadow-lg rounded-4 p-4 p-md-5">
//                         <div className="text-center mb-4"><div className="badge rounded-pill mb-3" style={{backgroundColor: 'var(--primary-color-light)', color: 'var(--primary-color)'}}><span className="fw-bold">Question {questionIndex + 1} of {questions.length}</span></div><h2 className="h3 fw-bold" style={{ color: 'var(--text-primary)'}}>{currentQuestion.question}</h2>{currentQuestion.isIntervention && <span className="badge bg-success-subtle text-success-emphasis">Here's a confidence booster!</span>}</div>
//                         <div className="row g-3">{Array.isArray(currentQuestion.options) && currentQuestion.options.map((option, index) => ( <div key={index} className="col-md-6"><button onClick={() => handleSelectAnswer(index)} disabled={showResult || showIntervention} className={`w-100 p-3 rounded-3 fs-5 fw-bold ${getButtonClass(index)}`}>{option}</button></div> ))}</div>
//                         <div className="mt-5"><div className="progress" style={{ height: '1rem' }}><div className="progress-bar" role="progressbar" style={{ width: `${progressPercentage}%` }} /></div><p className="text-center mt-2 small" style={{ color: 'var(--text-secondary)'}}>Progress: {questionIndex + 1}/{questions.length}</p></div>
//                     </div>
//                 </div>
//             </div>
//             <FacialEmotionTracker onEmotionChange={onEmotionChange} />
//             <InterventionSidebar show={showIntervention} onClose={closeIntervention} onGetEasierQuestion={handleGetEasierQuestion}/>
//         </div>
//     );
// };

// export default QuizPage;


// frontend/src/components/QuizPage.js (DEFINITIVE, STABLE ARCHITECTURE)

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Trophy } from 'lucide-react';
import FacialEmotionTracker from './FacialEmotionTracker';
import InterventionSidebar from './InterventionSidebar';

const NEXT_QUESTION_DELAY_MS = 1500;

const QuizPage = (props) => {
    // All props are passed in a single object
    const { questions, setQuestions, onQuizEnd, onAnswer, score, hearts, onEmotionChange, showIntervention, closeIntervention } = props;
    
    const { level } = useParams();
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    // --- THIS IS THE KEY TO THE FIX ---
    // We store all the props that change frequently in a ref.
    // A ref can be updated without causing the component to re-render.
    // This isolates the QuizPage's timers from App.js's state updates.
    const propsRef = useRef(props);
    useEffect(() => {
        propsRef.current = props;
    }, [props]);

    // This effect now has a STABLE dependency array. It will not be broken
    // by emotion updates in App.js anymore.
    useEffect(() => {
        let timer;
        if (showResult && !propsRef.current.showIntervention) {
            timer = setTimeout(() => {
                const { questions, onQuizEnd } = propsRef.current; // Use the latest props from the ref
                const isLastQuestion = questionIndex >= questions.length - 1;

                if (isLastQuestion) {
                    onQuizEnd({ correct: correctAnswers, total: questions.length, level });
                } else {
                    setQuestionIndex(prev => prev + 1);
                    setSelectedAnswer(null);
                    setShowResult(false);
                }
            }, NEXT_QUESTION_DELAY_MS);
        }
        return () => clearTimeout(timer);
    }, [showResult, questionIndex, correctAnswers, level]); // Minimal, stable dependencies


    const handleSelectAnswer = (selectedIndex) => {
        const { showIntervention, questions, onAnswer } = propsRef.current; // Use latest props
        if (showResult || showIntervention) return;

        const currentQuestion = questions[questionIndex];
        setSelectedAnswer(selectedIndex);
        setShowResult(true);
        
        const isCorrect = selectedIndex === currentQuestion.correct;
        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
        }
        onAnswer(isCorrect, level);
    };
    
    const handleGetEasierQuestion = async () => {
        const { setQuestions, closeIntervention } = propsRef.current;
        try {
            const res = await axios.get('http://localhost:5000/api/quizzes/easy-question');
            const easierQuestion = { ...res.data, isIntervention: true };
            // Use functional update form for safety
            setQuestions(prevQuestions => {
                const newQuestions = [...prevQuestions];
                newQuestions.splice(questionIndex + 1, 0, easierQuestion);
                return newQuestions;
            });
            closeIntervention();
        } catch (err) {
            alert("Sorry, couldn't load an easier question.");
            closeIntervention();
        }
    };
    
    if (!questions || questions.length === 0 || !questions[questionIndex]) {
        return <div className="p-5 text-center" style={{ color: 'var(--text-primary)' }}><h2>Loading Quiz...</h2></div>;
    }

    const currentQuestion = questions[questionIndex];
    const getButtonClass = (index) => { if (!showResult) return 'btn btn-outline-primary'; if (index === currentQuestion.correct) return 'btn btn-success'; if (index === selectedAnswer) return 'btn btn-danger'; return 'btn btn-outline-secondary disabled'; };
    const progressPercentage = ((questionIndex + 1) / questions.length) * 100;

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
            <div style={{ filter: showIntervention ? 'blur(4px)' : 'none', transition: 'filter 0.3s ease-in-out', pointerEvents: showIntervention ? 'none' : 'auto' }} className="p-3 p-md-4 d-flex flex-column">
                <div className="container-xl">
                    <div className="card shadow-sm rounded-4 p-3 mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <button onClick={() => onQuizEnd({ correct: correctAnswers, total: questions.length, level })} className="btn btn-secondary fw-bold">← End Quiz</button>
                            <div className="d-flex align-items-center">
                                <div className="badge p-2 rounded-pill me-2" style={{ background: 'rgba(255, 193, 7, 0.1)', color: 'var(--warning-color)'}}><Trophy className="me-1" size={18} /> <span className="fw-bold fs-6">{score}</span></div>
                                <div className="badge p-2 rounded-pill" style={{ background: 'rgba(220, 53, 69, 0.1)', color: 'var(--danger-color)'}}><Heart className="me-1" size={18} /> <span className="fw-bold fs-6">{hearts}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="card shadow-lg rounded-4 p-4 p-md-5">
                        <div className="text-center mb-4">
                            <div className="badge rounded-pill mb-3" style={{backgroundColor: 'var(--primary-color-light)', color: 'var(--primary-color)'}}><span className="fw-bold">Question {questionIndex + 1} of {questions.length}</span></div>
                            <h2 className="h3 fw-bold" style={{ color: 'var(--text-primary)'}}>{currentQuestion.question}</h2>
                            {currentQuestion.isIntervention && <span className="badge bg-success-subtle text-success-emphasis">Here's a confidence booster!</span>}
                        </div>
                        <div className="row g-3">
                            {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option, index) => (
                                <div key={index} className="col-md-6">
                                    <button onClick={() => handleSelectAnswer(index)} disabled={showResult || showIntervention} className={`w-100 p-3 rounded-3 fs-5 fw-bold ${getButtonClass(index)}`}>{option}</button>
                                </div>
                            ))}
                        </div>
                        {/* --- ADDED BACK THE RESULT FEEDBACK --- */}
                        {showResult && (
                            <div className="mt-4 text-center">
                                {selectedAnswer === currentQuestion.correct ? 
                                    <div className="alert alert-success"><p className="fw-bold h5 mb-0">🎉 Correct!</p></div> : 
                                    <div className="alert alert-danger"><p className="fw-bold h5">Not quite!</p><p className="mb-0">Correct answer: {currentQuestion.options[currentQuestion.correct]}</p></div>
                                }
                            </div>
                        )}
                        <div className="mt-5">
                            <div className="progress" style={{ height: '1rem' }}><div className="progress-bar" role="progressbar" style={{ width: `${progressPercentage}%` }} /></div>
                            <p className="text-center mt-2 small" style={{ color: 'var(--text-secondary)'}}>Progress: {questionIndex + 1}/{questions.length}</p>
                        </div>
                    </div>
                </div>
            </div>
            <FacialEmotionTracker onEmotionChange={onEmotionChange} />
            <InterventionSidebar 
                show={showIntervention}
                onClose={closeIntervention}
                onGetEasierQuestion={handleGetEasierQuestion}
            />
        </div>
    );
};

export default QuizPage;

