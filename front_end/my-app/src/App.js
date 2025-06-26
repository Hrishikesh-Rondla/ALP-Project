import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import QuizPage from './components/QuizPage';
import TherapistDashboard from './components/TherapistDashboard';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  // --- STATE MANAGEMENT ---
  // Overall session state
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);

  // Cumulative performance tracker
  const [studentPerformance, setStudentPerformance] = useState({
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  });

  // --- NEW & MODIFIED STATE FOR CORRECT RECOMMENDATIONS ---
  const [isEvaluated, setIsEvaluated] = useState(false);
  // This new state holds the result of ONLY the last evaluation quiz
  const [lastEvaluationResult, setLastEvaluationResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setCurrentPage(parsedUser.role === 'therapist' ? 'therapist-dashboard' : 'dashboard');
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    setUser(userData.user);
    setCurrentPage(userData.user.role === 'therapist' ? 'therapist-dashboard' : 'dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('login');
    setScore(0);
    setHearts(3);
    setIsEvaluated(false);
    setLastEvaluationResult(null); // Reset evaluation result on logout
    setStudentPerformance({ easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } });
  };

  const handleStartQuiz = (level) => {
    setHearts(3);
    setCurrentQuiz(level);
    setCurrentPage('quiz');
  };

  // --- MODIFIED handleQuizEnd ---
  // It now accepts a 'result' object from the QuizPage
  const handleQuizEnd = (result) => {
    if (currentQuiz === 'medium' && result) {
      setIsEvaluated(true);
      setLastEvaluationResult(result); // Store the specific result of the evaluation
    }
    setCurrentQuiz(null);
    setCurrentPage('dashboard');
  };

  // handleAnswer remains the same, correctly updating the overall session score
  const handleAnswer = (isCorrect, quizLevel) => {
    setStudentPerformance(prev => {
      const newPerf = { ...prev };
      newPerf[quizLevel].total += 1;
      if (isCorrect) {
        newPerf[quizLevel].correct += 1;
        const points = quizLevel === 'easy' ? 10 : quizLevel === 'medium' ? 20 : 30;
        setScore(s => s + points);
      } else {
        setHearts(h => Math.max(0, h - 1));
      }
      return newPerf;
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard
          user={user}
          score={score} // Pass the live score
          hearts={hearts}
          studentPerformance={studentPerformance} // Pass the cumulative performance
          onStartQuiz={handleStartQuiz}
          onLogout={handleLogout}
          isEvaluated={isEvaluated}
          lastEvaluationResult={lastEvaluationResult} // Pass the specific evaluation result
        />;
      case 'quiz':
        return <QuizPage
          currentQuiz={currentQuiz}
          score={score} // Pass the current score to display
          hearts={hearts} // Pass the current hearts to display
          onAnswer={handleAnswer}
          onQuizEnd={handleQuizEnd}
        />;
      // Other cases remain the same...
      case 'therapist-dashboard':
        return <TherapistDashboard user={user} onLogout={handleLogout} />;
      case 'signup':
        return <SignupPage onLogin={handleAuthSuccess} setCurrentPage={setCurrentPage} />;
      case 'login':
      default:
        return <LoginPage onLogin={handleAuthSuccess} setCurrentPage={setCurrentPage} />;
    }
  };

  return <>{renderPage()}</>;
};

export default App;