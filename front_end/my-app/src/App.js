








// // src/App.js (Updated for Confetti)

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import Dashboard from './components/Dashboard';
// import QuizPage from './components/QuizPage';
// import TherapistDashboard from './components/TherapistDashboard';

// const App = () => {
//     const [currentPage, setCurrentPage] = useState('login');
//     const [user, setUser] = useState(null);
//     const [currentQuizLevel, setCurrentQuizLevel] = useState(null);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [loadingQuiz, setLoadingQuiz] = useState(false);
    
//     // --- NEW STATE FOR CONFETTI ---
//     const [showConfetti, setShowConfetti] = useState(false);

//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         const token = localStorage.getItem('token');
//         if (token && storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//             setCurrentPage(parsedUser.role === 'therapist' ? 'therapist-dashboard' : 'dashboard');
//         }
//     }, []);

//     const handleLogin = (loggedInUser, page) => {
//         setUser(loggedInUser);
//         setCurrentPage(page);
//     };

//     const handleLogout = () => {
//         setUser(null);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         setCurrentPage('login');
//     };

//     const handleStartQuiz = async (level) => {
//         // Hide confetti when starting a new quiz
//         setShowConfetti(false);
//         setLoadingQuiz(true);
//         setCurrentQuizLevel(level);
//         try {
//             const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
//             setQuizQuestions(res.data);
//             setCurrentPage('quiz');
//         } catch (err) {
//             alert('Failed to load the quiz. Please make sure the backend server is running.');
//             console.error("Quiz load error:", err);
//         } finally {
//             setLoadingQuiz(false);
//         }
//     };

//     // --- UPDATED handleQuizEnd to trigger confetti ---
//     const handleQuizEnd = () => {
//         const latestUserData = localStorage.getItem('user');
//         if (latestUserData) {
//             setUser(JSON.parse(latestUserData));
//         }
        
//         // Show confetti for 5 seconds when a quiz is finished!
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 5000);

//         setCurrentPage('dashboard');
//         setQuizQuestions([]);
//         setCurrentQuizLevel(null);
//     };

//     const handleAnswer = async (isCorrect, quizLevel) => {
//         if (!user || !user.id) {
//             alert("User session error. Please log in again.");
//             return handleLogout();
//         }

//         let updatedPerformance;
//         let updatedScore;

//         setUser(prevUser => {
//             const newPerformance = JSON.parse(JSON.stringify(prevUser.performance || { easy: {}, medium: {}, hard: {} }));
//             if (!newPerformance[quizLevel]) {
//                 newPerformance[quizLevel] = { correct: 0, total: 0 };
//             }
//             newPerformance[quizLevel].total += 1;

//             let newScore = prevUser.score || 0;
//             if (isCorrect) {
//                 newPerformance[quizLevel].correct += 1;
//                 const points = quizLevel === 'easy' ? 10 : quizLevel === 'medium' ? 20 : 30;
//                 newScore += points;
//             }
//             updatedPerformance = newPerformance;
//             updatedScore = newScore;
//             return { ...prevUser, performance: newPerformance, score: newScore };
//         });

//         try {
//             const body = {
//                 userId: user.id,
//                 performance: updatedPerformance,
//                 score: updatedScore
//             };
//             const res = await axios.post('http://localhost:5000/api/users/update-progress', body);
//             localStorage.setItem('user', JSON.stringify(res.data));
//         } catch (err) {
//             console.error("Failed to save progress to the database:", err);
//             alert("There was an error saving your progress. Please check your connection.");
//         }
//     };

//     const renderPage = () => {
//         if (!user) {
//             switch (currentPage) {
//                 case 'signup': return <SignupPage setCurrentPage={setCurrentPage} />;
//                 default: return <LoginPage onLogin={handleLogin} setCurrentPage={setCurrentPage} />;
//             }
//         }

//         switch (currentPage) {
//             case 'dashboard':
//                 // --- PASSING THE NEW PROP TO DASHBOARD ---
//                 return <Dashboard
//                     user={user}
//                     score={user.score || 0}
//                     hearts={3}
//                     studentPerformance={user.performance || { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } }}
//                     onLogout={handleLogout}
//                     isEvaluated={user.isEvaluated || false}
//                     onStartQuiz={handleStartQuiz}
//                     showConfetti={showConfetti} // Pass the new prop
//                 />;
//             case 'therapist-dashboard':
//                 return <TherapistDashboard user={user} onLogout={handleLogout} />;
//             case 'quiz':
//                 if (loadingQuiz) return <div>Loading Quiz...</div>;
//                 const quizDataForPage = { [currentQuizLevel]: quizQuestions };
//                 return <QuizPage
//                     quizData={quizDataForPage}
//                     currentQuiz={currentQuizLevel}
//                     score={user.score || 0}
//                     hearts={3}
//                     onAnswer={handleAnswer}
//                     onQuizEnd={handleQuizEnd}
//                 />;
//             default:
//                 return <Dashboard user={user} onLogout={handleLogout} onStartQuiz={handleStartQuiz} />;
//         }
//     };

//     return <>{renderPage()}</>;
// };

// export default App;

// src/App.js (Updated to manage emotion state)

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import Dashboard from './components/Dashboard';
// import QuizPage from './components/QuizPage';
// import TherapistDashboard from './components/TherapistDashboard';

// const App = () => {
//     const [currentPage, setCurrentPage] = useState('login');
//     const [user, setUser] = useState(null);
//     const [currentQuizLevel, setCurrentQuizLevel] = useState(null);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [loadingQuiz, setLoadingQuiz] = useState(false);
//     const [showConfetti, setShowConfetti] = useState(false);

//     // --- NEW: STATE TO HOLD THE CURRENT DETECTED EMOTION ---
//     const [currentEmotion, setCurrentEmotion] = useState('neutral');

//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         const token = localStorage.getItem('token');
//         if (token && storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//             setCurrentPage(parsedUser.role === 'therapist' ? 'therapist-dashboard' : 'dashboard');
//         }
//     }, []);

//     const handleLogin = (loggedInUser, page) => {
//         setUser(loggedInUser);
//         setCurrentPage(page);
//     };

//     const handleLogout = () => {
//         setUser(null);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         setCurrentPage('login');
//     };

//     const handleStartQuiz = async (level) => {
//         setShowConfetti(false);
//         setLoadingQuiz(true);
//         setCurrentQuizLevel(level);
//         try {
//             const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
//             setQuizQuestions(res.data);
//             setCurrentPage('quiz');
//         } catch (err) {
//             alert('Failed to load the quiz. Please make sure the backend server is running.');
//             console.error("Quiz load error:", err);
//         } finally {
//             setLoadingQuiz(false);
//         }
//     };

//     const handleQuizEnd = () => {
//         const latestUserData = localStorage.getItem('user');
//         if (latestUserData) {
//             setUser(JSON.parse(latestUserData));
//         }
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 5000);
//         setCurrentPage('dashboard');
//         setQuizQuestions([]);
//         setCurrentQuizLevel(null);
//     };

//     // --- UPDATED: handleAnswer now sends the emotion data to the backend ---
//     const handleAnswer = async (isCorrect, quizLevel) => {
//         if (!user || !user.id) {
//             alert("User session error. Please log in again.");
//             return handleLogout();
//         }

//         let updatedPerformance;
//         let updatedScore;

//         setUser(prevUser => {
//             const newPerformance = JSON.parse(JSON.stringify(prevUser.performance || { easy: {}, medium: {}, hard: {} }));
//             if (!newPerformance[quizLevel]) {
//                 newPerformance[quizLevel] = { correct: 0, total: 0 };
//             }
//             newPerformance[quizLevel].total += 1;

//             let newScore = prevUser.score || 0;
//             if (isCorrect) {
//                 newPerformance[quizLevel].correct += 1;
//                 const points = quizLevel === 'easy' ? 10 : quizLevel === 'medium' ? 20 : 30;
//                 newScore += points;
//             }
//             updatedPerformance = newPerformance;
//             updatedScore = newScore;
//             return { ...prevUser, performance: newPerformance, score: newScore };
//         });

//         try {
//             // The body of our request now includes the quiz level and the current emotion
//             const body = {
//                 userId: user.id,
//                 performance: updatedPerformance,
//                 score: updatedScore,
//                 quizLevel: quizLevel,      // NEW
//                 emotion: currentEmotion,   // NEW
//             };
            
//             const res = await axios.post('http://localhost:5000/api/users/update-progress', body);
//             localStorage.setItem('user', JSON.stringify(res.data));
//         } catch (err) {
//             console.error("Failed to save progress to the database:", err);
//             alert("There was an error saving your progress. Please check your connection.");
//         }
//     };

//     const renderPage = () => {
//         if (!user) {
//             switch (currentPage) {
//                 case 'signup': return <SignupPage setCurrentPage={setCurrentPage} />;
//                 default: return <LoginPage onLogin={handleLogin} setCurrentPage={setCurrentPage} />;
//             }
//         }

//         switch (currentPage) {
//             case 'dashboard':
//                 return <Dashboard
//                     user={user}
//                     score={user.score || 0}
//                     hearts={3}
//                     studentPerformance={user.performance || { easy: {}, medium: {}, hard: {} }}
//                     onLogout={handleLogout}
//                     isEvaluated={user.isEvaluated || false}
//                     onStartQuiz={handleStartQuiz}
//                     showConfetti={showConfetti}
//                 />;
//             case 'therapist-dashboard':
//                 // We will add routing here later to go to a detail page
//                 return <TherapistDashboard user={user} onLogout={handleLogout} />;
//             case 'quiz':
//                 if (loadingQuiz) return <div>Loading Quiz...</div>;
//                 const quizDataForPage = { [currentQuizLevel]: quizQuestions };
//                 return <QuizPage
//                     quizData={quizDataForPage}
//                     currentQuiz={currentQuizLevel}
//                     score={user.score || 0}
//                     hearts={3}
//                     onAnswer={handleAnswer}
//                     onQuizEnd={handleQuizEnd}
//                     // --- NEW: Pass down the emotion state and the setter function ---
//                     currentEmotion={currentEmotion}
//                     onEmotionChange={setCurrentEmotion}
//                 />;
//             default:
//                 return <Dashboard user={user} onLogout={handleLogout} onStartQuiz={handleStartQuiz} />;
//         }
//     };

//     return <>{renderPage()}</>;
// };

// export default App;

// src/App.js (Updated for React Router)

// import React, { useState, useEffect } from 'react';
// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import './App.css';
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import Dashboard from './components/Dashboard';
// import QuizPage from './components/QuizPage';
// import TherapistDashboard from './components/TherapistDashboard';
// // --- We will create this new component in the next step ---
// import StudentDetailPage from './components/StudentDetailPage'; 

// const App = () => {
//     // --- State management remains mostly the same ---
//     const [user, setUser] = useState(null);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [loadingQuiz, setLoadingQuiz] = useState(false);
//     const [showConfetti, setShowConfetti] = useState(false);
//     const [currentEmotion, setCurrentEmotion] = useState('neutral');
    
//     // --- React Router hooks for navigation ---
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Effect to check for logged-in user and handle initial navigation
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         const storedUser = localStorage.getItem('user');
//         if (token && storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//             // If user is logged in but on the login page, redirect them to their dashboard
//             if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
//                 navigate(parsedUser.role === 'therapist' ? '/therapist-dashboard' : '/dashboard');
//             }
//         } else {
//             // If no token, force redirect to login unless they are trying to sign up
//             if (location.pathname !== '/signup') {
//                 navigate('/login');
//             }
//         }
//     }, []); // Runs only once

//     // --- All handler functions remain the same, but now use navigate() ---
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
//         // Logic is the same, but navigation is handled by navigate()
//         setShowConfetti(false);
//         setLoadingQuiz(true);
//         try {
//             const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
//             setQuizQuestions(res.data);
//             navigate(`/quiz/${level}`); // Navigate to a dynamic quiz route
//         } catch (err) {
//             alert('Failed to load the quiz.');
//         } finally {
//             setLoadingQuiz(false);
//         }
//     };
    
//     const handleQuizEnd = () => {
//         const latestUserData = localStorage.getItem('user');
//         if (latestUserData) {
//             setUser(JSON.parse(latestUserData));
//         }
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 5000);
//         navigate('/dashboard'); // Navigate back to the dashboard
//     };

//     const handleAnswer = async (isCorrect, quizLevel) => {
//         // Logic remains exactly the same
//         if (!user || !user.id) return handleLogout();
//         let updatedPerformance, updatedScore;
//         setUser(prev => {
//             const newUser = { ...prev };
//             newUser.performance = JSON.parse(JSON.stringify(prev.performance || { easy: {}, medium: {}, hard: {} }));
//             if (!newUser.performance[quizLevel]) newUser.performance[quizLevel] = { correct: 0, total: 0 };
//             newUser.performance[quizLevel].total += 1;
//             if (isCorrect) {
//                 newUser.performance[quizLevel].correct += 1;
//                 const points = quizLevel === 'easy' ? 10 : quizLevel === 'medium' ? 20 : 30;
//                 newUser.score = (newUser.score || 0) + points;
//             }
//             updatedPerformance = newUser.performance;
//             updatedScore = newUser.score;
//             return newUser;
//         });
//         try {
//             const body = { userId: user.id, performance: updatedPerformance, score: updatedScore, quizLevel, emotion: currentEmotion };
//             const res = await axios.post('http://localhost:5000/api/users/update-progress', body);
//             localStorage.setItem('user', JSON.stringify(res.data));
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     // --- Main render block now uses <Routes> and <Route> ---
//     return (
//         <Routes>
//             {/* Public Routes */}
//             <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
//             <Route path="/signup" element={<SignupPage />} />

//             {/* Protected Student Routes */}
//             {user && user.role === 'student' && (
//                 <>
//                     <Route path="/dashboard" element={
//                         <Dashboard
//                             user={user} score={user.score || 0} hearts={3}
//                             studentPerformance={user.performance} onLogout={handleLogout}
//                             isEvaluated={user.isEvaluated} onStartQuiz={handleStartQuiz}
//                             showConfetti={showConfetti}
//                         />
//                     }/>
//                     <Route path="/quiz/:level" element={
//                         <QuizPage
//                             quizData={{ questions: quizQuestions }} onQuizEnd={handleQuizEnd}
//                             onAnswer={handleAnswer} score={user.score || 0} hearts={3}
//                             currentEmotion={currentEmotion} onEmotionChange={setCurrentEmotion}
//                         />
//                     }/>
//                 </>
//             )}

//             {/* Protected Therapist Routes */}
//             {user && user.role === 'therapist' && (
//                 <>
//                     <Route path="/therapist-dashboard" element={<TherapistDashboard onLogout={handleLogout} />} />
//                     {/* The new detail page route! */}
//                     <Route path="/student/:studentId" element={<StudentDetailPage />} />
//                 </>
//             )}
            
//             {/* Fallback Route */}
//             <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
//         </Routes>
//     );
// };

// export default App;

// src/App.js (Corrected for QuizPage props)

// import React, { useState, useEffect } from 'react';
// import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
// import axios from 'axios';
// import './App.css'; // Make sure CSS is imported

// // Import all your components
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import Dashboard from './components/Dashboard';
// import QuizPage from './components/QuizPage';
// import TherapistDashboard from './components/TherapistDashboard';
// import StudentDetailPage from './components/StudentDetailPage'; 

// const App = () => {
//     // ... all your state declarations remain the same ...
//     const [user, setUser] = useState(null);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [loadingQuiz, setLoadingQuiz] = useState(false);
//     const [showConfetti, setShowConfetti] = useState(false);
//     const [currentEmotion, setCurrentEmotion] = useState('neutral');
    
//     const navigate = useNavigate();
//     const location = useLocation();

//     // ... useEffect for checking login remains the same ...
//     useEffect(() => { /* ... */ }, []);

//     // ... All handler functions (handleLogin, handleLogout, etc.) remain the same ...
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
//         } catch (err) { alert('Failed to load the quiz.'); } 
//         finally { setLoadingQuiz(false); }
//     };
//     const handleQuizEnd = () => {
//         const latestUserData = localStorage.getItem('user');
//         if (latestUserData) setUser(JSON.parse(latestUserData));
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 5000);
//         navigate('/dashboard');
//     };
//     const handleAnswer = async (isCorrect, quizLevel) => {
//         if (!user || !user.id) return handleLogout();
//         let updatedPerformance, updatedScore;
//         setUser(prev => {
//             const newUser = { ...prev };
//             newUser.performance = JSON.parse(JSON.stringify(prev.performance || { easy: {}, medium: {}, hard: {} }));
//             if (!newUser.performance[quizLevel]) newUser.performance[quizLevel] = { correct: 0, total: 0 };
//             newUser.performance[quizLevel].total += 1;
//             if (isCorrect) {
//                 newUser.performance[quizLevel].correct += 1;
//                 const points = quizLevel === 'easy' ? 10 : quizLevel === 'medium' ? 20 : 30;
//                 newUser.score = (newUser.score || 0) + points;
//             }
//             updatedPerformance = newUser.performance;
//             updatedScore = newUser.score;
//             return newUser;
//         });
//         try {
//             const body = { userId: user.id, performance: updatedPerformance, score: updatedScore, quizLevel, emotion: currentEmotion };
//             const res = await axios.post('http://localhost:5000/api/users/update-progress', body);
//             localStorage.setItem('user', JSON.stringify(res.data));
//         } catch (err) { console.error(err); }
//     };

//     return (
//         <Routes>
//             <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
//             <Route path="/signup" element={<SignupPage />} />

//             {user && user.role === 'student' && (
//                 <>
//                     <Route path="/dashboard" element={
//                         <Dashboard
//                             user={user} score={user.score || 0} hearts={3}
//                             studentPerformance={user.performance} onLogout={handleLogout}
//                             isEvaluated={user.isEvaluated} onStartQuiz={handleStartQuiz}
//                             showConfetti={showConfetti}
//                         />
//                     }/>
//                     {/* --- THIS IS THE CORRECTED ROUTE --- */}
//                     <Route path="/quiz/:level" element={
//                         loadingQuiz ? <div>Loading Quiz...</div> :
//                         <QuizPage
//                             questions={quizQuestions} // Pass the questions array directly
//                             onQuizEnd={handleQuizEnd}
//                             onAnswer={handleAnswer} 
//                             score={user.score || 0} 
//                             hearts={3}
//                             currentEmotion={currentEmotion} 
//                             onEmotionChange={setCurrentEmotion}
//                         />
//                     }/>
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

// src/App.js (Corrected)






// import React, { useState, useEffect } from 'react';
// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import './App.css';

// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import Dashboard from './components/Dashboard';
// import QuizPage from './components/QuizPage';
// import TherapistDashboard from './components/TherapistDashboard';
// import StudentDetailPage from './components/StudentDetailPage'; 

// const App = () => {
//     const [user, setUser] = useState(null);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [loadingQuiz, setLoadingQuiz] = useState(false);
//     const [showConfetti, setShowConfetti] = useState(false);
//     const [currentEmotion, setCurrentEmotion] = useState('neutral');
    
//     const navigate = useNavigate();
//     const location = useLocation();

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
//         } catch (err) { alert('Failed to load the quiz.'); } 
//         finally { setLoadingQuiz(false); }
//     };
//     const handleQuizEnd = () => {
//         const latestUserData = localStorage.getItem('user');
//         if (latestUserData) setUser(JSON.parse(latestUserData));
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 5000);
//         navigate('/dashboard');
//     };
//     const handleAnswer = async (isCorrect, quizLevel) => {
//         if (!user || !user.id) return handleLogout();
//         let updatedPerformance, updatedScore;
//         setUser(prev => {
//             const newUser = { ...prev };
//             newUser.performance = JSON.parse(JSON.stringify(prev.performance || { easy: {}, medium: {}, hard: {} }));
//             if (!newUser.performance[quizLevel]) newUser.performance[quizLevel] = { correct: 0, total: 0 };
//             newUser.performance[quizLevel].total += 1;
//             if (isCorrect) {
//                 newUser.performance[quizLevel].correct += 1;
//                 const points = quizLevel === 'easy' ? 10 : quizLevel === 'medium' ? 20 : 30;
//                 newUser.score = (newUser.score || 0) + points;
//             }
//             updatedPerformance = newUser.performance;
//             updatedScore = newUser.score;
//             return newUser;
//         });
//         try {
//             const body = { userId: user.id, performance: updatedPerformance, score: updatedScore, quizLevel: quizLevel, emotion: currentEmotion };
//             console.log("SENDING THIS TO BACKEND:", body);
//             const res = await axios.post('http://localhost:5000/api/users/update-progress', body);
//             localStorage.setItem('user', JSON.stringify(res.data));
//         } catch (err) { console.error(err); }
//     };

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

// // Ensure this line exists at the end of the file
// export default App;


// front_end/my-app/src/App.js (Complete and Corrected)

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import all your components
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import QuizPage from './components/QuizPage';
import TherapistDashboard from './components/TherapistDashboard';
import StudentDetailPage from './components/StudentDetailPage'; 

const App = () => {
    // --- STATE MANAGEMENT ---
    const [user, setUser] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState('neutral');
    
    // --- ROUTING HOOKS ---
    const navigate = useNavigate();
    const location = useLocation();

    // --- EFFECTS ---
    // This effect runs once to check if a user is already logged in from a previous session.
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // If the user is on a public page (like /login), redirect them to their dashboard.
            if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
                navigate(parsedUser.role === 'therapist' ? '/therapist-dashboard' : '/dashboard');
            }
        } else {
            // If there's no user data, force them to the login page.
            if (location.pathname !== '/signup') {
                navigate('/login');
            }
        }
    }, []); // The empty [] means this effect runs only on the initial render.


    // --- HANDLER FUNCTIONS ---
    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
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
            alert('Failed to load the quiz. Please ensure the backend server is running.'); 
        } finally { 
            setLoadingQuiz(false); 
        }
    };

    // const handleQuizEnd = () => {
    //     const latestUserData = localStorage.getItem('user');
    //     if (latestUserData) {
    //         setUser(JSON.parse(latestUserData));
    //     }
    //     setShowConfetti(true);
    //     setTimeout(() => setShowConfetti(false), 5000);
    //     navigate('/dashboard');
    // };
        // THIS IS THE NEW, CORRECTED VERSION
    const handleQuizEnd = () => {
    // Its only jobs are to show confetti and navigate.
    // The user state is already correct from the last handleAnswer call.
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
    navigate('/dashboard'); 
    };
    
    // This is the fully corrected version of the answer handler.
    const handleAnswer = async (isCorrect, quizLevel) => {
        if (!user || !user.id) {
            alert("User session error. Please log in again.");
            return handleLogout();
        }

        // --- THE FINAL CORRECTED LOGIC ---
        // 1. Calculate the new performance and score based on the CURRENT state.
        const newPerformance = JSON.parse(JSON.stringify(user.performance || { easy: {}, medium: {}, hard: {} }));
        if (!newPerformance[quizLevel]) {
            newPerformance[quizLevel] = { correct: 0, total: 0 };
        }
        newPerformance[quizLevel].total += 1;

        let newScore = user.score || 0;
        if (isCorrect) {
            newPerformance[quizLevel].correct += 1;
            const points = quizLevel === 'easy' ? 10 : quizLevel === 'medium' ? 20 : 30;
            newScore += points;
        }

        // 2. Update the user interface immediately for a smooth experience.
        setUser({
            ...user,
            performance: newPerformance,
            score: newScore,
        });

        // 3. Now, send the clean, calculated data to the backend to be saved permanently.
        try {
            const body = {
                userId: user.id,
                performance: newPerformance, // Use the new object we created
                score: newScore,             // Use the new value we created
                quizLevel: quizLevel,
                emotion: currentEmotion,
            };

            console.log("DEBUG: Sending this data to the backend --->", body);
            
            const res = await axios.post('http://localhost:5000/api/users/update-progress', body);
            
            // 4. Update the browser's storage with the final, confirmed data from the server.
            localStorage.setItem('user', JSON.stringify(res.data));

        } catch (err) {
            console.error("Failed to save progress:", err);
            alert("There was an error saving your progress.");
            // Optional: You could revert the UI update here if the save fails.
            // setUser(user); 
        }
    };


    // --- RENDER LOGIC ---
    return (
        <Routes>
            {/* Public Routes accessible to everyone */}
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes for logged-in Students */}
            {user && user.role === 'student' && (
                <>
                    <Route path="/dashboard" element={
                        <Dashboard 
                            user={user} 
                            score={user.score || 0} 
                            hearts={3} 
                            studentPerformance={user.performance} 
                            onLogout={handleLogout} 
                            isEvaluated={user.isEvaluated} 
                            onStartQuiz={handleStartQuiz} 
                            showConfetti={showConfetti} 
                        />
                    }/>
                    <Route path="/quiz/:level" element={
                        loadingQuiz ? <div>Loading Quiz...</div> : 
                        <QuizPage 
                            questions={quizQuestions} 
                            onQuizEnd={handleQuizEnd}
                            onAnswer={handleAnswer} 
                            score={user.score || 0} 
                            hearts={3}
                            currentEmotion={currentEmotion} 
                            onEmotionChange={setCurrentEmotion}
                        />
                    }/>
                </>
            )}

            {/* Protected Routes for the logged-in Therapist */}
            {user && user.role === 'therapist' && (
                <>
                    <Route path="/therapist-dashboard" element={<TherapistDashboard onLogout={handleLogout} />} />
                    <Route path="/student/:studentId" element={<StudentDetailPage />} />
                </>
            )}
            
            {/* Fallback route - if no other route matches, go to login */}
            <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
    );
};

export default App;

