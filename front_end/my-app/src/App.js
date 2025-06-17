import React, { useState } from 'react';

// Data
import { quizData } from './data/quizData';
import { studentsData } from './data/studentsData';
import { therapistCredentials } from './data/therapistCredentials';

// Components
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import QuizPage from './components/QuizPage';
import TherapistDashboard from './components/TherapistDashboard';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [studentPerformance, setStudentPerformance] = useState({
    easy: { correct: 0, total: 0, scores: [] },
    medium: { correct: 0, total: 0, scores: [] },
    hard: { correct: 0, total: 0, scores: [] }
  });

  const handleLogin = (userData, page) => {
    setUser(userData);
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    // Reset student progress for a new session
    setScore(0);
    setHearts(3);
    setStudentPerformance({
      easy: { correct: 0, total: 0, scores: [] },
      medium: { correct: 0, total: 0, scores: [] },
      hard: { correct: 0, total: 0, scores: [] }
    });
  };

  const handleStartQuiz = (level) => {
    setCurrentQuiz(level);
    setCurrentPage('quiz');
  };

  const handleQuizEnd = () => {
    setCurrentPage('dashboard');
    setCurrentQuiz(null);
  };

  const handleAnswer = (isCorrect, quizLevel) => {
    setStudentPerformance(prev => {
      const newPerf = { ...prev };
      newPerf[quizLevel].total += 1;
      if (isCorrect) {
        newPerf[quizLevel].correct += 1;
        const points = quizLevel === 'easy' ? 10 : quizLevel === 'medium' ? 20 : 30;
        setScore(s => s + points);
      } else {
        setHearts(h => h - 1);
      }
      return newPerf;
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'signup':
        return <SignupPage setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard
          user={user}
          score={score}
          hearts={hearts}
          studentPerformance={studentPerformance}
          onStartQuiz={handleStartQuiz}
          onLogout={handleLogout}
        />;
      case 'quiz':
        return <QuizPage
          quizData={quizData}
          currentQuiz={currentQuiz}
          score={score}
          hearts={hearts}
          onAnswer={handleAnswer}
          onQuizEnd={handleQuizEnd}
        />;
      case 'therapist-dashboard':
        return <TherapistDashboard
          user={user}
          studentsData={studentsData}
          onLogout={handleLogout}
        />;
      case 'login':
      default:
        return <LoginPage
          onLogin={handleLogin}
          setCurrentPage={setCurrentPage}
          therapistCredentials={therapistCredentials}
        />;
    }
  };

  return <>{renderPage()}</>;
};

export default App;