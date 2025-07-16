


// frontend/src/App.js (UPDATED with global switcher)

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import './App.css';

// --- 1. IMPORT THE GLOBAL THEMESWITCHER ---
import ThemeSwitcher from './components/ThemeSwitcher';

import LoginPage from './components/LoginPage';
// ... other component imports
import QuizPage from './components/QuizPage';
import StudentDetailPage from './components/StudentDetailPage';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import TherapistDashboard from './components/TherapistDashboard';
import Dashboard from './components/Dashboard';
import TherapistSignupPage from './components/TherapistSignupPage';
import SignupPage from './components/SignupPage';


function App() {
    // ... all your existing state and functions (useState, handleLogin, etc.) remain unchanged ...
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentEmotion, setCurrentEmotion] = useState('loading...');
    const [score, setScore] = useState(0);
    const [hearts, setHearts] = useState(3);
    const [studentPerformance, setStudentPerformance] = useState({});
    const [isEvaluated, setIsEvaluated] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [lastQuizResult, setLastQuizResult] = useState(null);
    const [emotionTally, setEmotionTally] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setScore(parsedUser.score || 0);
            setStudentPerformance(parsedUser.performance || {});
            setIsEvaluated(parsedUser.isEvaluated || false);
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        setScore(userData.score || 0);
        setStudentPerformance(userData.performance || {});
        setIsEvaluated(userData.isEvaluated || false);
        setLastQuizResult(null);
        if (userData.role === 'student') navigate('/student-dashboard');
        else if (userData.role === 'therapist') navigate('/therapist-dashboard');
        else if (userData.role === 'superadmin') navigate('/superadmin-dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        setLastQuizResult(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleQuizEnd = async (result) => {
        if (!user) return;
        setLastQuizResult(result);
        const newPerformance = JSON.parse(JSON.stringify(studentPerformance));
        newPerformance[result.level] = { correct: result.correct, total: result.total };
        const newScore = score + (result.correct * 10);
        const evaluated = isEvaluated || result.level === 'medium';
        if (evaluated && !isEvaluated) setShowConfetti(true);
        setStudentPerformance(newPerformance);
        setScore(newScore);
        setIsEvaluated(evaluated);
        try {
            const token = localStorage.getItem('token');
            const updatedUserData = { userId: user.id, performance: newPerformance, score: newScore, quizLevel: result.level, emotionTally: emotionTally };
            const res = await axios.post('http://localhost:5000/api/users/update-progress', updatedUserData, { headers: { 'x-auth-token': token } });
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
            console.error("Failed to save progress:", err);
            alert("Could not save your progress. Please check your connection.");
        }
        navigate('/student-dashboard');
    };

    const startQuiz = async (level) => {
        setEmotionTally({}); 
        try {
            const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
            setQuizQuestions(res.data);
            navigate(`/quiz/${level}`);
        } catch (err) {
            alert('Failed to load quiz. Please try again.');
        }
    };

    const handleAnswer = (isCorrect) => {
        if (!isCorrect) setHearts(prev => Math.max(0, prev - 1));
    };

    const handleEmotionChange = useCallback((emotion) => {
        if (emotion && emotion !== 'loading...' && emotion !== 'error') {
            setCurrentEmotion(emotion);
            setEmotionTally(prevTally => ({
                ...prevTally,
                [emotion]: (prevTally[emotion] || 0) + 1
            }));
        }
    }, []);

    if (loading) {
        return <div className="p-5 text-center"><h2>Initializing Application...</h2></div>;
    }

    return (
        // --- 2. PLACE THE THEMESWITCHER HERE ---
        // It's outside the <Routes> so it will render on every page.
        // It only shows up if the user is logged in.
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
                <Route path="/quiz/:level" element={user?.role === 'student' ? <QuizPage questions={quizQuestions} onQuizEnd={handleQuizEnd} onAnswer={handleAnswer} score={score} hearts={hearts} currentEmotion={currentEmotion} onEmotionChange={handleEmotionChange} /> : <Navigate to="/login" />} />
                <Route path="/student/:studentId" element={user?.role === 'therapist' ? <StudentDetailPage /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

// AppWrapper remains the same
const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;