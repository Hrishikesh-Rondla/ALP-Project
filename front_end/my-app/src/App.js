// frontend/src/App.js

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

// --- Import all your page/view components ---
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

    // --- MODIFIED: Centralized state for the quiz and progress ---
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentEmotion, setCurrentEmotion] = useState('loading...');
    const [score, setScore] = useState(0);
    const [hearts, setHearts] = useState(3); // You can make this part of the quiz logic too
    const [studentPerformance, setStudentPerformance] = useState({});
    const [isEvaluated, setIsEvaluated] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // --- NEW: State to hold the result of the most recently completed quiz ---
    const [lastQuizResult, setLastQuizResult] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Initialize state from the stored user object
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
        setLastQuizResult(null); // Clear last quiz result on login
        if (userData.role === 'student') navigate('/dashboard');
        else if (userData.role === 'therapist') navigate('/therapist-dashboard');
        else if (userData.role === 'superadmin') navigate('/superadmin-dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        setLastQuizResult(null); // Clear last quiz result on logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // --- HEAVILY MODIFIED: This function now handles all progress updates ---
    const handleQuizEnd = async (result) => {
        if (!user) return; // Safety check

        // 1. Set the result of this quiz to be displayed on the dashboard
        setLastQuizResult(result);

        // 2. Create a deep copy of the current performance to avoid state mutation
        const newPerformance = JSON.parse(JSON.stringify(studentPerformance));
        newPerformance[result.level] = {
            correct: result.correct,
            total: result.total
        };

        // 3. Calculate new total score
        const newScore = score + (result.correct * 10); // Add 10 points per correct answer

        // 4. Determine if the user has now been evaluated
        const evaluated = isEvaluated || result.level === 'medium';
        if (evaluated && !isEvaluated) {
            setShowConfetti(true); // Trigger confetti on first evaluation
        }

        // 5. Update state
        setStudentPerformance(newPerformance);
        setScore(newScore);
        setIsEvaluated(evaluated);

        // 6. Save everything to the backend
        try {
            const token = localStorage.getItem('token');
            const updatedUserData = {
                userId: user.id,
                performance: newPerformance,
                score: newScore,
                // In a real app, you'd also send the collected emotion data here
            };
            const res = await axios.post('http://localhost:5000/api/users/update-progress', updatedUserData, {
                headers: { 'x-auth-token': token }
            });

            // 7. Update the user object in localStorage with the fresh data from the server
            localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
            console.error("Failed to save progress:", err);
            alert("Could not save your progress. Please check your connection.");
        }

        // 8. Navigate to the dashboard to see the results
        navigate('/dashboard');
    };

    const startQuiz = async (level) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
            setQuizQuestions(res.data);
            navigate(`/quiz/${level}`);
        } catch (err) {
            alert('Failed to load quiz. Please try again.');
        }
    };

    const handleAnswer = (isCorrect, quizLevel) => {
        if (!isCorrect) {
            setHearts(prev => Math.max(0, prev - 1));
        }
    };

    if (loading) {
        return <div className="p-5 text-center"><h2>Initializing Application...</h2></div>;
    }

    return (
        <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            {/* ... other public routes */}
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/therapist-signup" element={<TherapistSignupPage />} />

            <Route path="/" element={!user ? <Navigate to="/login" /> : <Navigate to={`/${user.role}-dashboard`} />} />

            <Route path="/dashboard" element={user?.role === 'student' ? <Dashboard user={user} onLogout={handleLogout} onStartQuiz={startQuiz} score={score} hearts={hearts} studentPerformance={studentPerformance} isEvaluated={isEvaluated} showConfetti={showConfetti} lastQuizResult={lastQuizResult} /> : <Navigate to="/login" />} />

            <Route path="/quiz/:level" element={user?.role === 'student' ? <QuizPage questions={quizQuestions} onQuizEnd={handleQuizEnd} onAnswer={handleAnswer} score={score} hearts={hearts} currentEmotion={currentEmotion} onEmotionChange={setCurrentEmotion} /> : <Navigate to="/login" />} />

            {/* ... other protected routes */}
            <Route path="/therapist-dashboard" element={user?.role === 'therapist' ? <TherapistDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/student/:studentId" element={user?.role === 'therapist' ? <StudentDetailPage /> : <Navigate to="/login" />} />
            <Route path="/superadmin-dashboard" element={user?.role === 'superadmin' ? <SuperAdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;