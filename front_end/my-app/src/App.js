
// // front_end/my-app/src/App.js (Corrected)

// import React, { useState, useEffect } from 'react';
// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import './App.css';

// // Import all your components
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import Dashboard from './components/Dashboard';
// import QuizPage from './components/QuizPage';
// import TherapistDashboard from './components/TherapistDashboard';
// import StudentDetailPage from './components/StudentDetailPage'; 

// const App = () => {
//     // --- STATE MANAGEMENT ---
//     const [user, setUser] = useState(null);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [loadingQuiz, setLoadingQuiz] = useState(false);
//     const [showConfetti, setShowConfetti] = useState(false);
//     const [currentEmotion, setCurrentEmotion] = useState('neutral');
    
//     // --- ROUTING HOOKS ---
//     const navigate = useNavigate();
//     const location = useLocation();

//     // --- EFFECTS ---
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         const storedUser = localStorage.getItem('user');
//         if (token && storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//             if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
//                 navigate(parsedUser.role === 'therapist' ? '/therapist-dashboard' : '/dashboard');
//             }
//         } else {
//             if (location.pathname !== '/signup') {
//                 navigate('/login');
//             }
//         }
//     }, []);


//     // --- HANDLER FUNCTIONS ---
//     const handleLogin = (loggedInUser) => {
//         setUser(loggedInUser);
//         navigate(loggedInUser.role === 'therapist' ? '/therapist-dashboard' : '/dashboard');
//     };

//     const handleLogout = () => {
//         setUser(null);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         navigate('/login');
//     };

//     const handleStartQuiz = async (level) => {
//         setShowConfetti(false);
//         setLoadingQuiz(true);
//         try {
//             const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
//             setQuizQuestions(res.data);
//             navigate(`/quiz/${level}`);
//         } catch (err) { 
//             alert('Failed to load the quiz. Please ensure the backend server is running.'); 
//         } finally { 
//             setLoadingQuiz(false); 
//         }
//     };

//     // --- THIS IS THE CORRECTED FUNCTION ---
//     const handleQuizEnd = () => {
//         // After a quiz, the most up-to-date user data is in localStorage,
//         // which was just updated by the last handleAnswer API call.
//         // We MUST sync our React state with this new data BEFORE navigating.
        
//         const latestUserDataString = localStorage.getItem('user');
        
//         if (latestUserDataString) {
//             const latestUserData = JSON.parse(latestUserDataString);
//             // This call to setUser is critical. It updates React's in-memory `user` object
//             // with the new data, including the `isEvaluated: true` flag.
//             setUser(latestUserData);
//         }

//         // Now that the state is guaranteed to be up-to-date, we do the UI tasks.
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 5000);
//         navigate('/dashboard');
//     };
//     // --- END OF CORRECTED FUNCTION ---
    
//     const handleAnswer = async (isCorrect, quizLevel) => {
//         if (!user || !user.id) {
//             alert("User session error. Please log in again.");
//             return handleLogout();
//         }

//         const newPerformance = JSON.parse(JSON.stringify(user.performance || { easy: {}, medium: {}, hard: {} }));
//         if (!newPerformance[quizLevel]) {
//             newPerformance[quizLevel] = { correct: 0, total: 0 };
//         }
//         newPerformance[quizLevel].total += 1;

//         let newScore = user.score || 0;
//         if (isCorrect) {
//             newPerformance[quizLevel].correct += 1;
//             const points = quizLevel === 'easy' ? 10 : quizLevel === 'medium' ? 20 : 30;
//             newScore += points;
//         }

//         setUser({
//             ...user,
//             performance: newPerformance,
//             score: newScore,
//         });

//         try {
//             const body = {
//                 userId: user.id,
//                 performance: newPerformance,
//                 score: newScore,
//                 quizLevel: quizLevel,
//                 emotion: currentEmotion,
//             };
            
//             const res = await axios.post('http://localhost:5000/api/users/update-progress', body);
            
//             localStorage.setItem('user', JSON.stringify(res.data));

//         } catch (err) {
//             console.error("Failed to save progress:", err);
//             alert("There was an error saving your progress.");
//         }
//     };


//     // --- RENDER LOGIC ---
//     return (
//         <Routes>
//             <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
//             <Route path="/signup" element={<SignupPage />} />
//             {user && user.role === 'student' && (
//                 <>
//                     <Route path="/dashboard" element={<Dashboard user={user} score={user.score || 0} hearts={3} studentPerformance={user.performance} onLogout={handleLogout} isEvaluated={user.isEvaluated} onStartQuiz={handleStartQuiz} showConfetti={showConfetti} />} />
//                     <Route path="/quiz/:level" element={loadingQuiz ? <div>Loading Quiz...</div> : <QuizPage questions={quizQuestions} onQuizEnd={handleQuizEnd} onAnswer={handleAnswer} score={user.score || 0} hearts={3} currentEmotion={currentEmotion} onEmotionChange={setCurrentEmotion} />} />
//                 </>
//             )}
//             {user && user.role === 'therapist' && (
//                 <>
//                     <Route path="/therapist-dashboard" element={<TherapistDashboard onLogout={handleLogout} />} />
//                     <Route path="/student/:studentId" element={<StudentDetailPage />} />
//                 </>
//             )}
//             <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
//         </Routes>
//     );
// };

// export default App;

// src/App.js (Updated with Page Transitions)

// import React, { useState, useEffect } from 'react';
// // --- IMPORT FRAMER MOTION ---
// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import { AnimatePresence, motion } from 'framer-motion';
// import axios from 'axios';
// import './App.css';

// // Import all your components
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import Dashboard from './components/Dashboard';
// import QuizPage from './components/QuizPage';
// import TherapistDashboard from './components/TherapistDashboard';
// import StudentDetailPage from './components/StudentDetailPage'; 

// // --- DEFINE THE ANIMATION VARIANT ---
// const pageVariants = {
//     initial: {
//         opacity: 0,
//         y: 20
//     },
//     in: {
//         opacity: 1,
//         y: 0
//     },
//     out: {
//         opacity: 0,
//         y: -20
//     }
// };

// const pageTransition = {
//     type: "tween",
//     ease: "anticipate",
//     duration: 0.5
// };

// // --- WRAP A COMPONENT WITH THE ANIMATION ---
// const AnimatedPage = ({ children }) => (
//     <motion.div
//         initial="initial"
//         animate="in"
//         exit="out"
//         variants={pageVariants}
//         transition={pageTransition}
//     >
//         {children}
//     </motion.div>
// );


// const App = () => {
//     // All your state and handler functions remain exactly the same
//     const [user, setUser] = useState(null);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [loadingQuiz, setLoadingQuiz] = useState(false);
//     const [showConfetti, setShowConfetti] = useState(false);
//     const [currentEmotion, setCurrentEmotion] = useState('neutral');
    
//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => { /* ... no changes here ... */ }, []);
//     const handleLogin = (loggedInUser) => { /* ... no changes here ... */ };
//     const handleLogout = () => { /* ... no changes here ... */ };
//     const handleStartQuiz = async (level) => { /* ... no changes here ... */ };
//     const handleQuizEnd = () => { /* ... no changes here ... */ };
//     const handleAnswer = async (isCorrect, quizLevel) => { /* ... no changes here ... */ };


//     // --- RENDER LOGIC UPDATED FOR ANIMATION ---
//     return (
//         // AnimatePresence is the key. It tracks when routes change.
//         // We use location.key to ensure it re-evaluates on every route change.
//         <AnimatePresence mode="wait">
//             <Routes location={location} key={location.key}>
//                 <Route path="/login" element={<AnimatedPage><LoginPage onLogin={handleLogin} /></AnimatedPage>} />
//                 <Route path="/signup" element={<AnimatedPage><SignupPage /></AnimatedPage>} />
                
//                 {user && user.role === 'student' && (
//                     <>
//                         <Route path="/dashboard" element={<AnimatedPage><Dashboard user={user} score={user.score || 0} hearts={3} studentPerformance={user.performance} onLogout={handleLogout} isEvaluated={user.isEvaluated} onStartQuiz={handleStartQuiz} showConfetti={showConfetti} /></AnimatedPage>} />
//                         <Route path="/quiz/:level" element={<AnimatedPage>{loadingQuiz ? <div>Loading Quiz...</div> : <QuizPage questions={quizQuestions} onQuizEnd={handleQuizEnd} onAnswer={handleAnswer} score={user.score || 0} hearts={3} currentEmotion={currentEmotion} onEmotionChange={setCurrentEmotion} />}</AnimatedPage>} />
//                     </>
//                 )}

//                 {user && user.role === 'therapist' && (
//                     <>
//                         <Route path="/therapist-dashboard" element={<AnimatedPage><TherapistDashboard onLogout={handleLogout} /></AnimatedPage>} />
//                         <Route path="/student/:studentId" element={<AnimatedPage><StudentDetailPage /></AnimatedPage>} />
//                     </>
//                 )}
                
//                 <Route path="*" element={<AnimatedPage><LoginPage onLogin={handleLogin} /></AnimatedPage>} />
//             </Routes>
//         </AnimatePresence>
//     );
// };

// export default App;

// src/App.js (Definitive Final Version)

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import './App.css';

// Import all components
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import QuizPage from './components/QuizPage';
import TherapistDashboard from './components/TherapistDashboard';
import StudentDetailPage from './components/StudentDetailPage'; 

// Animation definitions
const pageVariants = { initial: { opacity: 0, y: "2vh" }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: "-2vh" } };
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.4 };
const AnimatedPage = ({ children }) => ( <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="page-container">{children}</motion.div> );

const App = () => {
    const [user, setUser] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState('neutral');
    
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            if (['/', '/login', '/signup'].includes(location.pathname)) {
                navigate(parsedUser.role === 'therapist' ? '/therapist-dashboard' : '/dashboard');
            }
        } else if (location.pathname !== '/signup') {
            navigate('/login');
        }
    }, []);

    // --- THIS IS THE CORRECTED LOGIN HANDLER ---
    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        // After setting the user, we programmatically navigate to the correct dashboard
        navigate(loggedInUser.role === 'therapist' ? '/therapist-dashboard' : '/dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleStartQuiz = async (level) => {
        setShowConfetti(false);
        setLoadingQuiz(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
            setQuizQuestions(res.data);
            navigate(`/quiz/${level}`);
        } catch (err) { 
            alert('Failed to load quiz.'); 
        } finally { 
            setLoadingQuiz(false); 
        }
    };

    const handleQuizEnd = () => {
        const latestUserDataString = localStorage.getItem('user');
        if (latestUserDataString) setUser(JSON.parse(latestUserDataString));
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        navigate('/dashboard');
    };
    
    const handleAnswer = async (isCorrect, quizLevel) => {
        if (!user || !user.id) return handleLogout();
        const newPerformance = JSON.parse(JSON.stringify(user.performance || { easy: {}, medium: {}, hard: {} }));
        if (!newPerformance[quizLevel]) newPerformance[quizLevel] = { correct: 0, total: 0 };
        newPerformance[quizLevel].total += 1;
        let newScore = user.score || 0;
        if (isCorrect) {
            newPerformance[quizLevel].correct += 1;
            const points = quizLevel === 'easy' ? 10 : quizLevel === 'medium' ? 20 : 30;
            newScore += points;
        }
        setUser({ ...user, performance: newPerformance, score: newScore });
        try {
            const body = { userId: user.id, performance: newPerformance, score: newScore, quizLevel, emotion: currentEmotion };
            const res = await axios.post('http://localhost:5000/api/users/update-progress', body);
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
            console.error("Failed to save progress:", err);
        }
    };

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/login" element={<AnimatedPage><LoginPage onLogin={handleLogin} /></AnimatedPage>} />
                <Route path="/signup" element={<AnimatedPage><SignupPage /></AnimatedPage>} />
                
                {user && user.role === 'student' && (
                    <>
                        <Route path="/dashboard" element={<AnimatedPage><Dashboard user={user} score={user.score || 0} hearts={3} studentPerformance={user.performance} onLogout={handleLogout} isEvaluated={user.isEvaluated} onStartQuiz={handleStartQuiz} showConfetti={showConfetti} /></AnimatedPage>} />
                        <Route path="/quiz/:level" element={<AnimatedPage>{loadingQuiz ? <div>Loading...</div> : <QuizPage questions={quizQuestions} onQuizEnd={handleQuizEnd} onAnswer={handleAnswer} score={user.score || 0} hearts={3} currentEmotion={currentEmotion} onEmotionChange={setCurrentEmotion} />}</AnimatedPage>} />
                    </>
                )}
                {user && user.role === 'therapist' && (
                    <>
                        <Route path="/therapist-dashboard" element={<AnimatedPage><TherapistDashboard onLogout={handleLogout} user={user} /></AnimatedPage>} />
                        <Route path="/student/:studentId" element={<AnimatedPage><StudentDetailPage /></AnimatedPage>} />
                    </>
                )}
                <Route path="*" element={<AnimatedPage><LoginPage onLogin={handleLogin} /></AnimatedPage>} />
            </Routes>
        </AnimatePresence>
    );
};

export default App;
