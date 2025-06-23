import React, { useState } from 'react';
import { quizData } from './data/quizData';
import { studentsData } from './data/studentsData';
import { therapistCredentials } from './data/therapistCredentials';
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
  const [isEvaluated, setIsEvaluated] = useState(false); // New state for adaptive flow
  const [studentPerformance, setStudentPerformance] = useState({
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 }
  });

  const handleLogin = (credentials, page) => {
    if (credentials.type === 'student') {
      const student = studentsData.find(s => s.username.toLowerCase() === credentials.username.toLowerCase() && s.password === credentials.password);
      if (student) {
        setUser({ name: student.name, type: "student" });
        setCurrentPage('dashboard');
      } else {
        alert('Invalid student name or password!');
      }
    } else { // Therapist login
      setUser(credentials);
      setCurrentPage(page);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setScore(0);
    setHearts(3);
    setIsEvaluated(false); // Reset evaluation status on logout
    setStudentPerformance({ easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } });
  };

  const handleStartQuiz = (level) => {
    setHearts(3); // Reset hearts for every new quiz attempt
    setCurrentQuiz(level);
    setCurrentPage('quiz');
  };

  const handleQuizEnd = () => {
    // If the quiz just taken was the medium evaluation, mark as evaluated
    if (currentQuiz === 'medium') {
      setIsEvaluated(true);
    }
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
        setHearts(h => Math.max(0, h - 1)); // Prevent hearts from going below 0
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
          isEvaluated={isEvaluated}
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
        return <TherapistDashboard user={user} studentsData={studentsData} onLogout={handleLogout} />;
      case 'login':
      default:
        return <LoginPage onLogin={handleLogin} setCurrentPage={setCurrentPage} therapistCredentials={therapistCredentials} />;
    }
  };

  return <>{renderPage()}</>;
};

export default App;