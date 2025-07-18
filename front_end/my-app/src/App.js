


// // frontend/src/App.js (UPDATED with global switcher)

// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

// import './App.css';

// // --- 1. IMPORT THE GLOBAL THEMESWITCHER ---
// import ThemeSwitcher from './components/ThemeSwitcher';

// import LoginPage from './components/LoginPage';
// // ... other component imports
// import QuizPage from './components/QuizPage';
// import StudentDetailPage from './components/StudentDetailPage';
// import SuperAdminDashboard from './components/SuperAdminDashboard';
// import TherapistDashboard from './components/TherapistDashboard';
// import Dashboard from './components/Dashboard';
// import TherapistSignupPage from './components/TherapistSignupPage';
// import SignupPage from './components/SignupPage';


// function App() {
//     // ... all your existing state and functions (useState, handleLogin, etc.) remain unchanged ...
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [currentEmotion, setCurrentEmotion] = useState('loading...');
//     const [score, setScore] = useState(0);
//     const [hearts, setHearts] = useState(3);
//     const [studentPerformance, setStudentPerformance] = useState({});
//     const [isEvaluated, setIsEvaluated] = useState(false);
//     const [showConfetti, setShowConfetti] = useState(false);
//     const [lastQuizResult, setLastQuizResult] = useState(null);
//     const [emotionTally, setEmotionTally] = useState({});
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//             setScore(parsedUser.score || 0);
//             setStudentPerformance(parsedUser.performance || {});
//             setIsEvaluated(parsedUser.isEvaluated || false);
//         }
//         setLoading(false);
//     }, []);

//     const handleLogin = (userData) => {
//         setUser(userData);
//         setScore(userData.score || 0);
//         setStudentPerformance(userData.performance || {});
//         setIsEvaluated(userData.isEvaluated || false);
//         setLastQuizResult(null);
//         if (userData.role === 'student') navigate('/student-dashboard');
//         else if (userData.role === 'therapist') navigate('/therapist-dashboard');
//         else if (userData.role === 'superadmin') navigate('/superadmin-dashboard');
//     };

//     const handleLogout = () => {
//         setUser(null);
//         setLastQuizResult(null);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         navigate('/login');
//     };

//     const handleQuizEnd = async (result) => {
//         if (!user) return;
//         setLastQuizResult(result);
//         const newPerformance = JSON.parse(JSON.stringify(studentPerformance));
//         newPerformance[result.level] = { correct: result.correct, total: result.total };
//         const newScore = score + (result.correct * 10);
//         const evaluated = isEvaluated || result.level === 'medium';
//         if (evaluated && !isEvaluated) setShowConfetti(true);
//         setStudentPerformance(newPerformance);
//         setScore(newScore);
//         setIsEvaluated(evaluated);
//         try {
//             const token = localStorage.getItem('token');
//             const updatedUserData = { userId: user.id, performance: newPerformance, score: newScore, quizLevel: result.level, emotionTally: emotionTally };
//             const res = await axios.post('http://localhost:5000/api/users/update-progress', updatedUserData, { headers: { 'x-auth-token': token } });
//             localStorage.setItem('user', JSON.stringify(res.data));
//         } catch (err) {
//             console.error("Failed to save progress:", err);
//             alert("Could not save your progress. Please check your connection.");
//         }
//         navigate('/student-dashboard');
//     };

//     const startQuiz = async (level) => {
//         setEmotionTally({}); 
//         try {
//             const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
//             setQuizQuestions(res.data);
//             navigate(`/quiz/${level}`);
//         } catch (err) {
//             alert('Failed to load quiz. Please try again.');
//         }
//     };

//     const handleAnswer = (isCorrect) => {
//         if (!isCorrect) setHearts(prev => Math.max(0, prev - 1));
//     };

//     const handleEmotionChange = useCallback((emotion) => {
//         if (emotion && emotion !== 'loading...' && emotion !== 'error') {
//             setCurrentEmotion(emotion);
//             setEmotionTally(prevTally => ({
//                 ...prevTally,
//                 [emotion]: (prevTally[emotion] || 0) + 1
//             }));
//         }
//     }, []);

//     if (loading) {
//         return <div className="p-5 text-center"><h2>Initializing Application...</h2></div>;
//     }

//     return (
//         // --- 2. PLACE THE THEMESWITCHER HERE ---
//         // It's outside the <Routes> so it will render on every page.
//         // It only shows up if the user is logged in.
//         <>
//             {user && <ThemeSwitcher />}
//             <Routes>
//                 <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
//                 <Route path="/signup" element={<SignupPage />} />
//                 <Route path="/therapist-signup" element={<TherapistSignupPage />} />
//                 <Route path="/" element={!user ? <Navigate to="/login" /> : <Navigate to={`/${user.role}-dashboard`} />} />
//                 <Route path="/student-dashboard" element={user?.role === 'student' ? <Dashboard user={user} onLogout={handleLogout} onStartQuiz={startQuiz} score={score} hearts={hearts} studentPerformance={studentPerformance} isEvaluated={isEvaluated} showConfetti={showConfetti} lastQuizResult={lastQuizResult} /> : <Navigate to="/login" />} />
//                 <Route path="/therapist-dashboard" element={user?.role === 'therapist' ? <TherapistDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
//                 <Route path="/superadmin-dashboard" element={user?.role === 'superadmin' ? <SuperAdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
//                 <Route path="/quiz/:level" element={user?.role === 'student' ? <QuizPage questions={quizQuestions} onQuizEnd={handleQuizEnd} onAnswer={handleAnswer} score={score} hearts={hearts} currentEmotion={currentEmotion} onEmotionChange={handleEmotionChange} /> : <Navigate to="/login" />} />
//                 <Route path="/student/:studentId" element={user?.role === 'therapist' ? <StudentDetailPage /> : <Navigate to="/login" />} />
//                 <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//         </>
//     );
// }

// // AppWrapper remains the same
// const AppWrapper = () => (
//     <Router>
//         <App />
//     </Router>
// );

// export default AppWrapper;

// frontend/src/App.js (FINAL, COMPLETE, AND STABLE)

// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

// import './App.css';

// // --- Component Imports ---
// import ThemeSwitcher from './components/ThemeSwitcher';
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import TherapistSignupPage from './components/TherapistSignupPage';
// import Dashboard from './components/Dashboard';
// import TherapistDashboard from './components/TherapistDashboard';
// import SuperAdminDashboard from './components/SuperAdminDashboard';
// import StudentDetailPage from './components/StudentDetailPage';
// import QuizPage from './components/QuizPage'; // Or NewQuizPage if you renamed it

// function App() {
//     // --- State Management ---
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [currentEmotion, setCurrentEmotion] = useState('loading...');
//     const [score, setScore] = useState(0);
//     const [hearts, setHearts] = useState(3);
//     const [studentPerformance, setStudentPerformance] = useState({});
//     const [isEvaluated, setIsEvaluated] = useState(false);
//     const [showConfetti, setShowConfetti] = useState(false);
//     const [lastQuizResult, setLastQuizResult] = useState(null);
//     const [emotionTally, setEmotionTally] = useState({});
//     const navigate = useNavigate();

//     // --- Effects ---
//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//             setScore(parsedUser.score || 0);
//             setStudentPerformance(parsedUser.performance || {});
//             setIsEvaluated(parsedUser.isEvaluated || false);
//         }
//         setLoading(false);
//     }, []);

//     // --- Handlers ---
//     const handleLogin = (userData) => {
//         setUser(userData);
//         setScore(userData.score || 0);
//         setStudentPerformance(userData.performance || {});
//         setIsEvaluated(userData.isEvaluated || false);
//         setLastQuizResult(null);
//         if (userData.role === 'student') navigate('/student-dashboard');
//         else if (userData.role === 'therapist') navigate('/therapist-dashboard');
//         else if (userData.role === 'superadmin') navigate('/superadmin-dashboard');
//     };

//     const handleLogout = () => {
//         setUser(null);
//         setLastQuizResult(null);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         navigate('/login');
//     };

//     const handleQuizEnd = async (result) => {
//         if (!user) return;
        
//         // Add the collected emotion data to the result object for the dashboard
//         setLastQuizResult({ ...result, emotionTally: emotionTally });
        
//         const newPerformance = JSON.parse(JSON.stringify(studentPerformance));
//         newPerformance[result.level] = { correct: result.correct, total: result.total };
//         const newScore = score + (result.correct * 10);
//         const evaluated = isEvaluated || result.level === 'medium';
//         if (evaluated && !isEvaluated) setShowConfetti(true);
        
//         setStudentPerformance(newPerformance);
//         setScore(newScore);
//         setIsEvaluated(evaluated);

//         try {
//             const token = localStorage.getItem('token');
//             const updatedUserData = {
//                 userId: user.id,
//                 performance: newPerformance,
//                 score: newScore,
//                 quizLevel: result.level,
//                 emotionTally: emotionTally,
//             };
//             const res = await axios.post('http://localhost:5000/api/users/update-progress', updatedUserData, { headers: { 'x-auth-token': token } });
//             localStorage.setItem('user', JSON.stringify(res.data));
//         } catch (err) {
//             console.error("Failed to save progress:", err);
//             alert("Could not save your progress. Please check your connection.");
//         }
//         navigate('/student-dashboard');
//     };

//     const startQuiz = async (level) => {
//         setEmotionTally({}); // Reset the tally for the new quiz
//         try {
//             const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
//             setQuizQuestions(res.data);
//             navigate(`/quiz/${level}`);
//         } catch (err) {
//             alert('Failed to load quiz. Please try again.');
//         }
//     };

//     const handleAnswer = (isCorrect) => {
//         if (!isCorrect) setHearts(prev => Math.max(0, prev - 1));
//     };

//     // Use useCallback to prevent infinite re-renders and stabilize the emotion tracker
//     const handleEmotionChange = useCallback((emotion) => {
//         if (emotion && emotion !== 'loading...' && emotion !== 'error') {
//             setCurrentEmotion(emotion);
//             setEmotionTally(prevTally => ({
//                 ...prevTally,
//                 [emotion]: (prevTally[emotion] || 0) + 1
//             }));
//         }
//     }, []); // Empty dependency array is crucial for stability

//     // --- Render Logic ---
//     if (loading) {
//         return <div className="p-5 text-center"><h2>Initializing Application...</h2></div>;
//     }

//     return (
//         <>
//             {user && <ThemeSwitcher />}
//             <Routes>
//                 <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
//                 <Route path="/signup" element={<SignupPage />} />
//                 <Route path="/therapist-signup" element={<TherapistSignupPage />} />
                
//                 <Route path="/" element={!user ? <Navigate to="/login" /> : <Navigate to={`/${user.role}-dashboard`} />} />
                
//                 <Route path="/student-dashboard" element={user?.role === 'student' ? <Dashboard user={user} onLogout={handleLogout} onStartQuiz={startQuiz} score={score} hearts={hearts} studentPerformance={studentPerformance} isEvaluated={isEvaluated} showConfetti={showConfetti} lastQuizResult={lastQuizResult} /> : <Navigate to="/login" />} />
//                 <Route path="/therapist-dashboard" element={user?.role === 'therapist' ? <TherapistDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
//                 <Route path="/superadmin-dashboard" element={user?.role === 'superadmin' ? <SuperAdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
                
//                 <Route path="/quiz/:level" element={user?.role === 'student' ? <QuizPage questions={quizQuestions} onQuizEnd={handleQuizEnd} onAnswer={handleAnswer} score={score} currentEmotion={currentEmotion} onEmotionChange={handleEmotionChange} /> : <Navigate to="/login" />} />
                
//                 <Route path="/student/:studentId" element={user?.role === 'therapist' ? <StudentDetailPage /> : <Navigate to="/login" />} />
                
//                 <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//         </>
//     );
// }

// const AppWrapper = () => (
//     <Router>
//         <App />
//     </Router>
// );

// export default AppWrapper;
// frontend/src/App.js (UPDATED with Intervention Logic)

// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';

// import './App.css';
// import ThemeSwitcher from './components/ThemeSwitcher';
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import TherapistSignupPage from './components/TherapistSignupPage';
// import Dashboard from './components/Dashboard';
// import TherapistDashboard from './components/TherapistDashboard';
// import SuperAdminDashboard from './components/SuperAdminDashboard';
// import StudentDetailPage from './components/StudentDetailPage';
// import QuizPage from './components/QuizPage';

// function App() {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [score, setScore] = useState(0);
//     const [hearts, setHearts] = useState(3);
//     const [studentPerformance, setStudentPerformance] = useState({});
//     const [isEvaluated, setIsEvaluated] = useState(false);
//     const [showConfetti, setShowConfetti] = useState(false);
//     const [lastQuizResult, setLastQuizResult] = useState(null);
//     const [emotionTally, setEmotionTally] = useState({});
    
//     // --- State and refs for the intervention feature ---
//     const [showIntervention, setShowIntervention] = useState(false);
//     const negativeEmotionTimer = useRef(null);
//     const NEGATIVE_EMOTION_THRESHOLD = 8000; // 8 seconds

//     const navigate = useNavigate();

//     useEffect(() => { const storedUser = localStorage.getItem('user'); if (storedUser) { const u = JSON.parse(storedUser); setUser(u); setScore(u.score || 0); setStudentPerformance(u.performance || {}); setIsEvaluated(u.isEvaluated || false); } setLoading(false); }, []);

//     const handleLogin = (userData) => { setUser(userData); setScore(userData.score || 0); setStudentPerformance(userData.performance || {}); setIsEvaluated(userData.isEvaluated || false); setLastQuizResult(null); if (userData.role === 'student') navigate('/student-dashboard'); else if (userData.role === 'therapist') navigate('/therapist-dashboard'); else if (userData.role === 'superadmin') navigate('/superadmin-dashboard'); };
//     const handleLogout = () => { setUser(null); setLastQuizResult(null); localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };
//     const handleQuizEnd = async (result) => { if (!user) return; setLastQuizResult({ ...result, emotionTally }); const newPerformance = JSON.parse(JSON.stringify(studentPerformance)); newPerformance[result.level] = { correct: result.correct, total: result.total }; const newScore = score + (result.correct * 10); const evaluated = isEvaluated || result.level === 'medium'; if (evaluated && !isEvaluated) setShowConfetti(true); setStudentPerformance(newPerformance); setScore(newScore); setIsEvaluated(evaluated); try { const token = localStorage.getItem('token'); const updatedUserData = { userId: user.id, performance: newPerformance, score: newScore, quizLevel: result.level, emotionTally }; const res = await axios.post('http://localhost:5000/api/users/update-progress', updatedUserData, { headers: { 'x-auth-token': token } }); localStorage.setItem('user', JSON.stringify(res.data)); } catch (err) { alert("Could not save progress."); } navigate('/student-dashboard'); };
//     const startQuiz = async (level) => { setEmotionTally({}); closeIntervention(); try { const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`); setQuizQuestions(res.data); navigate(`/quiz/${level}`); } catch (err) { alert('Failed to load quiz.'); } };
//     const handleAnswer = (isCorrect) => { if (!isCorrect) setHearts(prev => Math.max(0, prev - 1)); };

//     const handleEmotionChange = useCallback((emotion) => {
//         if (emotion && emotion !== 'loading...' && emotion !== 'error') {
//             setEmotionTally(prevTally => ({ ...prevTally, [emotion]: (prevTally[emotion] || 0) + 1 }));
//             const negativeEmotions = ['sad', 'angry', 'fear'];
//             if (negativeEmotions.includes(emotion) && !showIntervention) {
//                 if (!negativeEmotionTimer.current) {
//                     negativeEmotionTimer.current = setTimeout(() => { setShowIntervention(true); }, NEGATIVE_EMOTION_THRESHOLD);
//                 }
//             } else {
//                 clearTimeout(negativeEmotionTimer.current);
//                 negativeEmotionTimer.current = null;
//             }
//         }
//     }, [showIntervention]);

//     const closeIntervention = useCallback(() => {
//         setShowIntervention(false);
//         clearTimeout(negativeEmotionTimer.current);
//         negativeEmotionTimer.current = null;
//     }, []);

//     if (loading) { return <div className="p-5 text-center"><h2>Initializing...</h2></div>; }

//     return (
//         <>
//             {user && <ThemeSwitcher />}
//             <Routes>
//                 <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
//                 <Route path="/signup" element={<SignupPage />} />
//                 <Route path="/therapist-signup" element={<TherapistSignupPage />} />
//                 <Route path="/" element={!user ? <Navigate to="/login" /> : <Navigate to={`/${user.role}-dashboard`} />} />
//                 <Route path="/student-dashboard" element={user?.role === 'student' ? <Dashboard user={user} onLogout={handleLogout} onStartQuiz={startQuiz} score={score} hearts={hearts} studentPerformance={studentPerformance} isEvaluated={isEvaluated} showConfetti={showConfetti} lastQuizResult={lastQuizResult} /> : <Navigate to="/login" />} />
//                 <Route path="/therapist-dashboard" element={user?.role === 'therapist' ? <TherapistDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
//                 <Route path="/superadmin-dashboard" element={user?.role === 'superadmin' ? <SuperAdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
//                 <Route path="/quiz/:level" element={user?.role === 'student' ? <QuizPage
//                     questions={quizQuestions}
//                     onQuizEnd={handleQuizEnd}
//                     onAnswer={handleAnswer}
//                     score={score}
//                     hearts={hearts}
//                     onEmotionChange={handleEmotionChange}
//                     showIntervention={showIntervention}
//                     closeIntervention={closeIntervention}
//                 /> : <Navigate to="/login" />} />
//                 <Route path="/student/:studentId" element={user?.role === 'therapist' ? <StudentDetailPage /> : <Navigate to="/login" />} />
//                 <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//         </>
//     );
// }
// const AppWrapper = () => ( <Router><App /></Router> );
// export default AppWrapper;


// frontend/src/App.js (DEFINITIVE, STABLE VERSION)

// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';

// import './App.css';
// import ThemeSwitcher from './components/ThemeSwitcher';
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import TherapistSignupPage from './components/TherapistSignupPage';
// import Dashboard from './components/Dashboard';
// import TherapistDashboard from './components/TherapistDashboard';
// import SuperAdminDashboard from './components/SuperAdminDashboard';
// import StudentDetailPage from './components/StudentDetailPage';
// import QuizPage from './components/QuizPage';

// function App() {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [score, setScore] = useState(0);
//     const [hearts, setHearts] = useState(3);
//     const [studentPerformance, setStudentPerformance] = useState({});
//     const [isEvaluated, setIsEvaluated] = useState(false);
//     const [showConfetti, setShowConfetti] = useState(false);
//     const [lastQuizResult, setLastQuizResult] = useState(null);
//     const [emotionTally, setEmotionTally] = useState({});
//     const [showIntervention, setShowIntervention] = useState(false);
//     const negativeEmotionTimer = useRef(null);
//     const NEGATIVE_EMOTION_THRESHOLD = 8000;
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             const u = JSON.parse(storedUser);
//             setUser(u); setScore(u.score || 0); setStudentPerformance(u.performance || {}); setIsEvaluated(u.isEvaluated || false);
//         }
//         setLoading(false);
//     }, []);

//     const handleLogin = useCallback((userData) => {
//         setUser(userData); setScore(userData.score || 0); setStudentPerformance(userData.performance || {}); setIsEvaluated(userData.isEvaluated || false); setLastQuizResult(null);
//         if (userData.role === 'student') navigate('/student-dashboard');
//         else if (userData.role === 'therapist') navigate('/therapist-dashboard');
//         else if (userData.role === 'superadmin') navigate('/superadmin-dashboard');
//     }, [navigate]);

//     const handleLogout = useCallback(() => {
//         setUser(null); setLastQuizResult(null); localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login');
//     }, [navigate]);

//     const handleQuizEnd = useCallback(async (result) => {
//         setShowIntervention(false);
//         clearTimeout(negativeEmotionTimer.current);
//         negativeEmotionTimer.current = null;
//         if (!user) return;
//         setLastQuizResult({ ...result, emotionTally });
        
//         const newPerformance = { ...studentPerformance, [result.level]: { correct: result.correct, total: result.total }};
//         const newScore = score + (result.correct * 10);
//         const evaluated = isEvaluated || result.level === 'medium';

//         setStudentPerformance(newPerformance); setScore(newScore); setIsEvaluated(evaluated);
//         if (evaluated && !isEvaluated) setShowConfetti(true);

//         try {
//             const token = localStorage.getItem('token');
//             const updatedUserData = { performance: newPerformance, score: newScore, quizLevel: result.level, emotionTally };
//             const res = await axios.post('http://localhost:5000/api/users/update-progress', updatedUserData, { headers: { 'x-auth-token': token } });
//             localStorage.setItem('user', JSON.stringify(res.data));
//         } catch (err) { alert("Could not save progress."); }
//         navigate('/student-dashboard');
//     }, [user, emotionTally, studentPerformance, score, isEvaluated, navigate]);

//     const startQuiz = useCallback(async (level) => {
//         setEmotionTally({});
//         setShowIntervention(false);
//         clearTimeout(negativeEmotionTimer.current);
//         negativeEmotionTimer.current = null;
//         try {
//             const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
//             setQuizQuestions(res.data); navigate(`/quiz/${level}`);
//         } catch (err) { alert('Failed to load quiz.'); }
//     }, [navigate]);

//     const handleAnswer = useCallback((isCorrect) => {
//         if (!isCorrect) setHearts(prev => Math.max(0, prev - 1));
//     }, []);

//     const closeIntervention = useCallback(() => {
//         setShowIntervention(false);
//         clearTimeout(negativeEmotionTimer.current);
//         negativeEmotionTimer.current = null;
//     }, []);

//     const handleEmotionChange = useCallback((emotion) => {
//         if (emotion && emotion !== 'loading...' && emotion !== 'error') {
//             setEmotionTally(prev => ({ ...prev, [emotion]: (prev[emotion] || 0) + 1 }));
//             const negativeEmotions = ['sad', 'angry', 'fear'];
//             if (negativeEmotions.includes(emotion) && !showIntervention) {
//                 if (!negativeEmotionTimer.current) {
//                     negativeEmotionTimer.current = setTimeout(() => { setShowIntervention(true); }, NEGATIVE_EMOTION_THRESHOLD);
//                 }
//             } else {
//                 clearTimeout(negativeEmotionTimer.current);
//                 negativeEmotionTimer.current = null;
//             }
//         }
//     }, [showIntervention]);

//     if (loading) { return <div className="p-5 text-center"><h2>Initializing...</h2></div>; }

//     return (
//         <>
//             {user && <ThemeSwitcher />}
//             <Routes>
//                 <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
//                 <Route path="/signup" element={<SignupPage />} />
//                 <Route path="/therapist-signup" element={<TherapistSignupPage />} />
//                 <Route path="/" element={!user ? <Navigate to="/login" /> : <Navigate to={`/${user.role}-dashboard`} />} />
//                 <Route path="/student-dashboard" element={user?.role === 'student' ? <Dashboard user={user} onLogout={handleLogout} onStartQuiz={startQuiz} score={score} hearts={hearts} studentPerformance={studentPerformance} isEvaluated={isEvaluated} showConfetti={showConfetti} lastQuizResult={lastQuizResult} /> : <Navigate to="/login" />} />
//                 <Route path="/therapist-dashboard" element={user?.role === 'therapist' ? <TherapistDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
//                 <Route path="/superadmin-dashboard" element={user?.role === 'superadmin' ? <SuperAdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
//                 <Route path="/quiz/:level" element={user?.role === 'student' ? <QuizPage
//                     questions={quizQuestions} setQuestions={setQuizQuestions} onQuizEnd={handleQuizEnd}
//                     onAnswer={handleAnswer} score={score} hearts={hearts}
//                     onEmotionChange={handleEmotionChange} showIntervention={showIntervention} closeIntervention={closeIntervention}
//                 /> : <Navigate to="/login" />} />
//                 <Route path="/student/:studentId" element={user?.role === 'therapist' ? <StudentDetailPage /> : <Navigate to="/login" />} />
//                 <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//         </>
//     );
// }
// const AppWrapper = () => ( <Router><App /></Router> );
// export default AppWrapper;


// frontend/src/App.js (DEFINITIVE, FULLY STABILIZED VERSION)

// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';

// import './App.css';
// import ThemeSwitcher from './components/ThemeSwitcher';
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import TherapistSignupPage from './components/TherapistSignupPage';
// import Dashboard from './components/Dashboard';
// import TherapistDashboard from './components/TherapistDashboard';
// import SuperAdminDashboard from './components/SuperAdminDashboard';
// import StudentDetailPage from './components/StudentDetailPage';
// import QuizPage from './components/QuizPage';

// function App() {
//     // --- State Management (Unchanged) ---
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [score, setScore] = useState(0);
//     const [hearts, setHearts] = useState(3);
//     const [studentPerformance, setStudentPerformance] = useState({});
//     const [isEvaluated, setIsEvaluated] = useState(false);
//     const [showConfetti, setShowConfetti] = useState(false);
//     const [lastQuizResult, setLastQuizResult] = useState(null);
//     const [emotionTally, setEmotionTally] = useState({});
//     const [showIntervention, setShowIntervention] = useState(false);
//     const negativeEmotionTimer = useRef(null);
//     const NEGATIVE_EMOTION_THRESHOLD = 8000;
//     const navigate = useNavigate();

//     // --- Effects (Unchanged) ---
//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             const u = JSON.parse(storedUser); setUser(u); setScore(u.score || 0); setStudentPerformance(u.performance || {}); setIsEvaluated(u.isEvaluated || false);
//         }
//         setLoading(false);
//     }, []);

//     // --- Handlers (ALL WRAPPED IN useCallback FOR STABILITY) ---

//     const handleLogin = useCallback((userData) => {
//         setUser(userData); setScore(userData.score || 0); setStudentPerformance(userData.performance || {}); setIsEvaluated(userData.isEvaluated || false); setLastQuizResult(null);
//         if (userData.role === 'student') navigate('/student-dashboard');
//         else if (userData.role === 'therapist') navigate('/therapist-dashboard');
//         else if (userData.role === 'superadmin') navigate('/superadmin-dashboard');
//     }, [navigate]);

//     const handleLogout = useCallback(() => {
//         setUser(null); setLastQuizResult(null); localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login');
//     }, [navigate]);

//     const closeIntervention = useCallback(() => {
//         setShowIntervention(false);
//         clearTimeout(negativeEmotionTimer.current);
//         negativeEmotionTimer.current = null;
//     }, []);

//     const handleQuizEnd = useCallback(async (result) => {
//         closeIntervention();
//         if (!user) return;
//         setLastQuizResult({ ...result, emotionTally });
//         const newPerformance = { ...studentPerformance, [result.level]: { correct: result.correct, total: result.total }};
//         const newScore = score + (result.correct * 10);
//         const evaluated = isEvaluated || result.level === 'medium';
//         setStudentPerformance(newPerformance); setScore(newScore); setIsEvaluated(evaluated);
//         if (evaluated && !isEvaluated) setShowConfetti(true);
//         try {
//             const token = localStorage.getItem('token');
//             const updatedUserData = { performance: newPerformance, score: newScore, quizLevel: result.level, emotionTally };
//             const res = await axios.post('http://localhost:5000/api/users/update-progress', updatedUserData, { headers: { 'x-auth-token': token } });
//             localStorage.setItem('user', JSON.stringify(res.data));
//         } catch (err) { alert("Could not save progress."); }
//         navigate('/student-dashboard');
//     }, [user, emotionTally, studentPerformance, score, isEvaluated, navigate, closeIntervention]);

//     const startQuiz = useCallback(async (level) => {
//         setEmotionTally({});
//         closeIntervention();
//         try {
//             const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
//             setQuizQuestions(res.data); navigate(`/quiz/${level}`);
//         } catch (err) { alert('Failed to load quiz.'); }
//     }, [navigate, closeIntervention]);

//     const handleAnswer = useCallback((isCorrect) => {
//         if (!isCorrect) setHearts(prev => Math.max(0, prev - 1));
//     }, []);

//     const handleEmotionChange = useCallback((emotion) => {
//         if (emotion && emotion !== 'loading...' && emotion !== 'error') {
//             setEmotionTally(prev => ({ ...prev, [emotion]: (prev[emotion] || 0) + 1 }));
//             const negativeEmotions = ['sad', 'angry', 'fear'];
//             if (negativeEmotions.includes(emotion) && !showIntervention) {
//                 if (!negativeEmotionTimer.current) {
//                     negativeEmotionTimer.current = setTimeout(() => { setShowIntervention(true); }, NEGATIVE_EMOTION_THRESHOLD);
//                 }
//             } else if (!negativeEmotions.includes(emotion)) {
//                 clearTimeout(negativeEmotionTimer.current);
//                 negativeEmotionTimer.current = null;
//             }
//         }
//     }, [showIntervention]);

//     if (loading) { return <div className="p-5 text-center"><h2>Initializing...</h2></div>; }

//     return (
//         <>
//             {user && <ThemeSwitcher />}
//             <Routes>
//                 <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
//                 <Route path="/signup" element={<SignupPage />} />
//                 <Route path="/therapist-signup" element={<TherapistSignupPage />} />
//                 <Route path="/" element={!user ? <Navigate to="/login" /> : <Navigate to={`/${user.role}-dashboard`} />} />
//                 <Route path="/student-dashboard" element={user?.role === 'student' ? <Dashboard user={user} onLogout={handleLogout} onStartQuiz={startQuiz} score={score} hearts={hearts} studentPerformance={studentPerformance} isEvaluated={isEvaluated} showConfetti={showConfetti} lastQuizResult={lastQuizResult} /> : <Navigate to="/login" />} />
//                 <Route path="/therapist-dashboard" element={user?.role === 'therapist' ? <TherapistDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
//                 <Route path="/superadmin-dashboard" element={user?.role === 'superadmin' ? <SuperAdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
//                 <Route path="/quiz/:level" element={user?.role === 'student' ? <QuizPage
//                     questions={quizQuestions} setQuestions={setQuizQuestions} onQuizEnd={handleQuizEnd}
//                     onAnswer={handleAnswer} score={score} hearts={hearts}
//                     onEmotionChange={handleEmotionChange} showIntervention={showIntervention} closeIntervention={closeIntervention}
//                 /> : <Navigate to="/login" />} />
//                 <Route path="/student/:studentId" element={user?.role === 'therapist' ? <StudentDetailPage /> : <Navigate to="/login" />} />
//                 <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//         </>
//     );
// }
// const AppWrapper = () => ( <Router><App /></Router> );
// export default AppWrapper;


// frontend/src/App.js (DEFINITIVE, FULLY STABILIZED VERSION)

// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';

// import './App.css';
// import ThemeSwitcher from './components/ThemeSwitcher';
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import TherapistSignupPage from './components/TherapistSignupPage';
// import Dashboard from './components/Dashboard';
// import TherapistDashboard from './components/TherapistDashboard';
// import SuperAdminDashboard from './components/SuperAdminDashboard';
// import StudentDetailPage from './components/StudentDetailPage';
// import QuizPage from './components/QuizPage';

// function App() {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [score, setScore] = useState(0);
//     const [hearts, setHearts] = useState(3);
//     const [studentPerformance, setStudentPerformance] = useState({});
//     const [isEvaluated, setIsEvaluated] = useState(false);
//     const [showConfetti, setShowConfetti] = useState(false);
//     const [lastQuizResult, setLastQuizResult] = useState(null);
//     const [emotionTally, setEmotionTally] = useState({});
//     const [showIntervention, setShowIntervention] = useState(false);
//     const negativeEmotionTimer = useRef(null);
//     const NEGATIVE_EMOTION_THRESHOLD = 8000;
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             const u = JSON.parse(storedUser); setUser(u); setScore(u.score || 0); setStudentPerformance(u.performance || {}); setIsEvaluated(u.isEvaluated || false);
//         }
//         setLoading(false);
//     }, []);

//     const handleLogin = useCallback((userData) => {
//         setUser(userData); setScore(userData.score || 0); setStudentPerformance(userData.performance || {}); setIsEvaluated(userData.isEvaluated || false); setLastQuizResult(null);
//         if (userData.role === 'student') navigate('/student-dashboard');
//         else if (userData.role === 'therapist') navigate('/therapist-dashboard');
//         else if (userData.role === 'superadmin') navigate('/superadmin-dashboard');
//     }, [navigate]);

//     const handleLogout = useCallback(() => {
//         setUser(null); setLastQuizResult(null); localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login');
//     }, [navigate]);

//     const closeIntervention = useCallback(() => {
//         setShowIntervention(false);
//         clearTimeout(negativeEmotionTimer.current);
//         negativeEmotionTimer.current = null;
//     }, []);

//     const handleQuizEnd = useCallback(async (result) => {
//         closeIntervention();
//         if (!user) return;
//         setLastQuizResult({ ...result, emotionTally });
        
//         const newPerformance = { ...studentPerformance, [result.level]: { correct: result.correct, total: result.total }};
//         const newScore = score + (result.correct * 10);
//         const evaluated = isEvaluated || result.level === 'medium';

//         setStudentPerformance(newPerformance); setScore(newScore); setIsEvaluated(evaluated);
//         if (evaluated && !isEvaluated) setShowConfetti(true);

//         try {
//             const token = localStorage.getItem('token');
//             if (!token) throw new Error("No token found");
//             const updatedUserData = { performance: newPerformance, score: newScore, quizLevel: result.level, emotionTally };
//             const res = await axios.post('http://localhost:5000/api/users/update-progress', updatedUserData, { headers: { 'x-auth-token': token } });
//             localStorage.setItem('user', JSON.stringify(res.data));
//         } catch (err) { alert("Session error. Could not save progress. Please log in again."); }
//         navigate('/student-dashboard');
//     }, [user, emotionTally, studentPerformance, score, isEvaluated, navigate, closeIntervention]);

//     const startQuiz = useCallback(async (level) => {
//         setEmotionTally({});
//         closeIntervention();
//         try {
//             const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
//             setQuizQuestions(res.data); navigate(`/quiz/${level}`);
//         } catch (err) { alert('Failed to load quiz.'); }
//     }, [navigate, closeIntervention]);

//     const handleAnswer = useCallback((isCorrect) => {
//         if (!isCorrect) setHearts(prev => Math.max(0, prev - 1));
//     }, []);

//     const handleEmotionChange = useCallback((emotion) => {
//         if (emotion && emotion !== 'loading...' && emotion !== 'error') {
//             setEmotionTally(prev => ({ ...prev, [emotion]: (prev[emotion] || 0) + 1 }));
//             const negativeEmotions = ['sad', 'angry', 'fear'];
//             if (negativeEmotions.includes(emotion) && !showIntervention) {
//                 if (!negativeEmotionTimer.current) {
//                     negativeEmotionTimer.current = setTimeout(() => { setShowIntervention(true); }, NEGATIVE_EMOTION_THRESHOLD);
//                 }
//             } else if (!negativeEmotions.includes(emotion)) {
//                 clearTimeout(negativeEmotionTimer.current);
//                 negativeEmotionTimer.current = null;
//             }
//         }
//     }, [showIntervention]);

//     if (loading) { return <div className="p-5 text-center"><h2>Initializing...</h2></div>; }

//     return (
//         <>
//             {user && <ThemeSwitcher />}
//             <Routes>
//                 <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
//                 <Route path="/signup" element={<SignupPage />} />
//                 <Route path="/therapist-signup" element={<TherapistSignupPage />} />
//                 <Route path="/" element={!user ? <Navigate to="/login" /> : <Navigate to={`/${user.role}-dashboard`} />} />
//                 <Route path="/student-dashboard" element={user?.role === 'student' ? <Dashboard user={user} onLogout={handleLogout} onStartQuiz={startQuiz} score={score} hearts={hearts} studentPerformance={studentPerformance} isEvaluated={isEvaluated} showConfetti={showConfetti} lastQuizResult={lastQuizResult} /> : <Navigate to="/login" />} />
//                 <Route path="/therapist-dashboard" element={user?.role === 'therapist' ? <TherapistDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
//                 <Route path="/superadmin-dashboard" element={user?.role === 'superadmin' ? <SuperAdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
//                 <Route path="/quiz/:level" element={user?.role === 'student' ? <QuizPage
//                     questions={quizQuestions} setQuestions={setQuestions} onQuizEnd={handleQuizEnd}
//                     onAnswer={handleAnswer} score={score} hearts={hearts}
//                     onEmotionChange={handleEmotionChange} showIntervention={showIntervention} closeIntervention={closeIntervention}
//                 /> : <Navigate to="/login" />} />
//                 <Route path="/student/:studentId" element={user?.role === 'therapist' ? <StudentDetailPage /> : <Navigate to="/login" />} />
//                 <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//         </>
//     );
// }

// const AppWrapper = () => ( <Router><App /></Router> );
// export default AppWrapper;


// frontend/src/App.js (DEFINITIVE, CORRECTED VERSION)

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

import './App.css';
import ThemeSwitcher from './components/ThemeSwitcher';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import TherapistSignupPage from './components/TherapistSignupPage';
import Dashboard from './components/Dashboard';
import TherapistDashboard from './components/TherapistDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import StudentDetailPage from './components/StudentDetailPage';
import QuizPage from './components/QuizPage';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [hearts, setHearts] = useState(3);
    const [studentPerformance, setStudentPerformance] = useState({});
    const [isEvaluated, setIsEvaluated] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [lastQuizResult, setLastQuizResult] = useState(null);
    const [emotionTally, setEmotionTally] = useState({});
    const [showIntervention, setShowIntervention] = useState(false);
    const negativeEmotionTimer = useRef(null);
    const NEGATIVE_EMOTION_THRESHOLD = 8000;
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const u = JSON.parse(storedUser); setUser(u); setScore(u.score || 0); setStudentPerformance(u.performance || {}); setIsEvaluated(u.isEvaluated || false);
        }
        setLoading(false);
    }, []);

    const handleLogin = useCallback((userData) => {
        setUser(userData); setScore(userData.score || 0); setStudentPerformance(userData.performance || {}); setIsEvaluated(userData.isEvaluated || false); setLastQuizResult(null);
        if (userData.role === 'student') navigate('/student-dashboard');
        else if (userData.role === 'therapist') navigate('/therapist-dashboard');
        else if (userData.role === 'superadmin') navigate('/superadmin-dashboard');
    }, [navigate]);

    const handleLogout = useCallback(() => {
        setUser(null); setLastQuizResult(null); localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login');
    }, [navigate]);

    const closeIntervention = useCallback(() => {
        setShowIntervention(false);
        clearTimeout(negativeEmotionTimer.current);
        negativeEmotionTimer.current = null;
    }, []);

    const handleQuizEnd = useCallback(async (result) => {
        closeIntervention();
        if (!user) return;
        setLastQuizResult({ ...result, emotionTally });
        
        const newPerformance = { ...studentPerformance, [result.level]: { correct: result.correct, total: result.total }};
        const newScore = score + (result.correct * 10);
        const evaluated = isEvaluated || result.level === 'medium';

        setStudentPerformance(newPerformance); setScore(newScore); setIsEvaluated(evaluated);
        if (evaluated && !isEvaluated) setShowConfetti(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No token found");
            const updatedUserData = { performance: newPerformance, score: newScore, quizLevel: result.level, emotionTally };
            const res = await axios.post('http://localhost:5000/api/users/update-progress', updatedUserData, { headers: { 'x-auth-token': token } });
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) { alert("Session error. Could not save progress. Please log in again."); }
        navigate('/student-dashboard');
    }, [user, emotionTally, studentPerformance, score, isEvaluated, navigate, closeIntervention]);

    const startQuiz = useCallback(async (level) => {
        setEmotionTally({});
        closeIntervention();
        try {
            const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
            setQuizQuestions(res.data); navigate(`/quiz/${level}`);
        } catch (err) { alert('Failed to load quiz.'); }
    }, [navigate, closeIntervention]);

    const handleAnswer = useCallback((isCorrect) => {
        if (!isCorrect) setHearts(prev => Math.max(0, prev - 1));
    }, []);

    const handleEmotionChange = useCallback((emotion) => {
        if (emotion && emotion !== 'loading...' && emotion !== 'error') {
            setEmotionTally(prev => ({ ...prev, [emotion]: (prev[emotion] || 0) + 1 }));
            const negativeEmotions = ['sad', 'angry', 'fear'];
            if (negativeEmotions.includes(emotion) && !showIntervention) {
                if (!negativeEmotionTimer.current) {
                    negativeEmotionTimer.current = setTimeout(() => { setShowIntervention(true); }, NEGATIVE_EMOTION_THRESHOLD);
                }
            } else if (!negativeEmotions.includes(emotion)) {
                clearTimeout(negativeEmotionTimer.current);
                negativeEmotionTimer.current = null;
            }
        }
    }, [showIntervention]);

    if (loading) { return <div className="p-5 text-center"><h2>Initializing...</h2></div>; }

    return (
        <>
            {user && <ThemeSwitcher />}
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/therapist-signup" element={<TherapistSignupPage />} />
                <Route path="/" element={!user ? <Navigate to="/login" /> : <Navigate to={`/${user.role}-dashboard`} />} />
                <Route path="/student-dashboard" element={user?.role === 'student' ? <Dashboard user={user} onLogout={handleLogout} onStartQuiz={startQuiz} score={score} hearts={hearts} studentPerformance={studentPerformance} isEvaluated={isEvaluated} showConfetti={showConfetti} lastQuizResult={lastQuizResult} /> : <Navigate to="/login" />} />
                <Route path="/therapist-dashboard" element={user?.role === 'therapist' ? <TherapistDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
                <Route path="/superadmin-dashboard" element={user?.role === 'superadmin' ? <SuperAdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
                
                {/* --- THIS IS THE FIX --- */}
                {/* The `setQuestions` prop has been removed from the QuizPage route. */}
                <Route path="/quiz/:level" element={user?.role === 'student' ? <QuizPage
                    questions={quizQuestions}
                    onQuizEnd={handleQuizEnd}
                    onAnswer={handleAnswer}
                    score={score}
                    hearts={hearts}
                    onEmotionChange={handleEmotionChange}
                    showIntervention={showIntervention}
                    closeIntervention={closeIntervention}
                /> : <Navigate to="/login" />} />
                
                <Route path="/student/:studentId" element={user?.role === 'therapist' ? <StudentDetailPage /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

const AppWrapper = () => ( <Router><App /></Router> );
export default AppWrapper;
