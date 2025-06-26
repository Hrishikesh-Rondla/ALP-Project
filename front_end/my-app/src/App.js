// import React, { useState } from 'react';
// import { quizData } from './data/quizData';
// import { studentsData } from './data/studentsData';
// import { therapistCredentials } from './data/therapistCredentials';
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import Dashboard from './components/Dashboard';
// import QuizPage from './components/QuizPage';
// import TherapistDashboard from './components/TherapistDashboard';

// const App = () => {
//   const [currentPage, setCurrentPage] = useState('login');
//   const [user, setUser] = useState(null);
//   const [currentQuiz, setCurrentQuiz] = useState(null);
//   const [score, setScore] = useState(0);
//   const [hearts, setHearts] = useState(3);
//   const [isEvaluated, setIsEvaluated] = useState(false); // New state for adaptive flow
//   const [studentPerformance, setStudentPerformance] = useState({
//     easy: { correct: 0, total: 0 },
//     medium: { correct: 0, total: 0 },
//     hard: { correct: 0, total: 0 }
//   });

//   const handleLogin = (credentials, page) => {
//     if (credentials.type === 'student') {
//       const student = studentsData.find(s => s.username.toLowerCase() === credentials.username.toLowerCase() && s.password === credentials.password);
//       if (student) {
//         setUser({ name: student.name, type: "student" });
//         setCurrentPage('dashboard');
//       } else {
//         alert('Invalid student name or password!');
//       }
//     } else { // Therapist login
//       setUser(credentials);
//       setCurrentPage(page);
//     }
//   };

//   const handleLogout = () => {
//     setUser(null);
//     setCurrentPage('login');
//     setScore(0);
//     setHearts(3);
//     setIsEvaluated(false); // Reset evaluation status on logout
//     setStudentPerformance({ easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } });
//   };

//   const handleStartQuiz = (level) => {
//     setHearts(3); // Reset hearts for every new quiz attempt
//     setCurrentQuiz(level);
//     setCurrentPage('quiz');
//   };

//   const handleQuizEnd = () => {
//     // If the quiz just taken was the medium evaluation, mark as evaluated
//     if (currentQuiz === 'medium') {
//       setIsEvaluated(true);
//     }
//     setCurrentPage('dashboard');
//     setCurrentQuiz(null);
//   };

//   const handleAnswer = (isCorrect, quizLevel) => {
//     setStudentPerformance(prev => {
//       const newPerf = { ...prev };
//       newPerf[quizLevel].total += 1;
//       if (isCorrect) {
//         newPerf[quizLevel].correct += 1;
//         const points = quizLevel === 'easy' ? 10 : quizLevel === 'medium' ? 20 : 30;
//         setScore(s => s + points);
//       } else {
//         setHearts(h => Math.max(0, h - 1)); // Prevent hearts from going below 0
//       }
//       return newPerf;
//     });
//   };

//   const renderPage = () => {
//     switch (currentPage) {
//       case 'signup':
//         return <SignupPage setCurrentPage={setCurrentPage} />;
//       case 'dashboard':
//         return <Dashboard
//           user={user}
//           score={score}
//           hearts={hearts}
//           studentPerformance={studentPerformance}
//           onStartQuiz={handleStartQuiz}
//           onLogout={handleLogout}
//           isEvaluated={isEvaluated}
//         />;
//       case 'quiz':
//         return <QuizPage
//           quizData={quizData}
//           currentQuiz={currentQuiz}
//           score={score}
//           hearts={hearts}
//           onAnswer={handleAnswer}
//           onQuizEnd={handleQuizEnd}
//         />;
//       case 'therapist-dashboard':
//         return <TherapistDashboard user={user} studentsData={studentsData} onLogout={handleLogout} />;
//       case 'login':
//       default:
//         return <LoginPage onLogin={handleLogin} setCurrentPage={setCurrentPage} therapistCredentials={therapistCredentials} />;
//     }
//   };

//   return <>{renderPage()}</>;
// };

// export default App;
// src/App.js

// import React, { useState, useEffect } from 'react';
// // Remove ALL data imports: quizData, studentsData, therapistCredentials
// import LoginPage from './components/LoginPage';
// import SignupPage from './components/SignupPage';
// import Dashboard from './components/Dashboard';
// import QuizPage from './components/QuizPage';
// import TherapistDashboard from './components/TherapistDashboard';

// const App = () => {
//   const [currentPage, setCurrentPage] = useState('login'); // Controls which page component to show
//   const [user, setUser] = useState(null); // Holds the logged-in user's data
  
//   // This effect checks if the user is already logged in when the app first loads
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const token = localStorage.getItem('token');
    
//     if (token && storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       setUser(parsedUser);
//       setCurrentPage(parsedUser.role === 'therapist' ? 'therapist-dashboard' : 'dashboard');
//     }
//   }, []); // The empty array [] means this runs only once on mount

//   // This function is passed down to LoginPage
//   const handleLogin = (loggedInUser, page) => {
//     setUser(loggedInUser);
//     setCurrentPage(page);
//   };

//   // This function is passed to the dashboard pages
//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setCurrentPage('login');
//   };

//   // The state for quizzes will be added back later,
//   // once we build the API endpoints for them.
//   // For now, we are focusing on authentication.

//   const renderPage = () => {
//     // If there is no user object, they must either login or signup
//     if (!user) {
//       switch (currentPage) {
//         case 'signup':
//           return <SignupPage setCurrentPage={setCurrentPage} />;
//         case 'login':
//         default:
//           return <LoginPage onLogin={handleLogin} setCurrentPage={setCurrentPage} />;
//       }
//     }

//     // If a user object exists, show pages based on their role
//     switch (currentPage) {
//       case 'dashboard':
//         // NOTE: We will need to fetch score, hearts, performance data from the API
//         // For now, we pass placeholder values.
//         return <Dashboard
//           user={user}
//           score={0}
//           hearts={3}
//           studentPerformance={{ easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } }}
//           onLogout={handleLogout}
//           isEvaluated={false}
//           onStartQuiz={() => alert('Quiz API not implemented yet!')}
//         />;
//       case 'therapist-dashboard':
//         // NOTE: We will need to fetch studentsData from the API
//         return <TherapistDashboard
//           user={user}
//           studentsData={[]} // Pass an empty array for now
//           onLogout={handleLogout}
//         />;
//       // The 'quiz' case can be added back later
//       default:
//         return <div>Page not found</div>;
//     }
//   };

//   return <>{renderPage()}</>;
// };

// export default App;



// src/App.js

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
    
//     // State for managing quizzes
//     const [currentQuizLevel, setCurrentQuizLevel] = useState(null);
//     const [quizQuestions, setQuizQuestions] = useState([]);
//     const [loadingQuiz, setLoadingQuiz] = useState(false);

//     // This effect runs once when the app loads to check for a logged-in user
//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         const token = localStorage.getItem('token');
//         if (token && storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUser(parsedUser);
//             setCurrentPage(parsedUser.role === 'therapist' ? 'therapist-dashboard' : 'dashboard');
//         }
//     }, []);

//     // Passed to LoginPage to set state after a successful API call
//     const handleLogin = (loggedInUser, page) => {
//         setUser(loggedInUser);
//         setCurrentPage(page);
//     };

//     // Passed to dashboard pages to clear state and local storage
//     const handleLogout = () => {
//         setUser(null);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         setCurrentPage('login');
//     };

//     // This is the function that now calls our backend API
//     const handleStartQuiz = async (level) => {
//         setLoadingQuiz(true);
//         setCurrentQuizLevel(level);
//         try {
//             // API CALL to our backend to get the questions for the chosen level
//             const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
//             setQuizQuestions(res.data);
//             setCurrentPage('quiz'); // Switch to the quiz page on success
//         } catch (err) {
//             alert('Failed to load the quiz. Please make sure the backend server is running and you have seeded the database.');
//             console.error("Quiz load error:", err);
//         } finally {
//             setLoadingQuiz(false);
//         }
//     };

//     const handleQuizEnd = () => {
//         // This is where you would ideally re-fetch the user's updated data
//         // For now, we'll just navigate back to the dashboard
//         setCurrentPage('dashboard');
//         setQuizQuestions([]);
//         setCurrentQuizLevel(null);
//     };

//     const handleAnswer = (isCorrect, quizLevel) => {
//         // This is a placeholder. A future step would be to create a POST
//         // endpoint like /api/quizzes/submit to record the answer.
//         console.log(`Answered ${isCorrect ? 'correctly' : 'incorrectly'} on ${quizLevel} quiz.`);
//         if (isCorrect) {
//             setUser(prevUser => ({ ...prevUser, score: (prevUser.score || 0) + 10 }));
//         }
//     };

//     // Main logic to decide which component to render
//     const renderPage = () => {
//         // If there's no user, they can only see login or signup pages
//         if (!user) {
//             switch (currentPage) {
//                 case 'signup': 
//                     return <SignupPage setCurrentPage={setCurrentPage} />;
//                 default: 
//                     return <LoginPage onLogin={handleLogin} setCurrentPage={setCurrentPage} />;
//             }
//         }

//         // If a user is logged in, show the appropriate page
//         switch (currentPage) {
//             case 'dashboard':
//                 return <Dashboard
//                     user={user}
//                     score={user.score || 0} // Use real user data from state
//                     hearts={3} // Hearts can be managed here if needed
//                     studentPerformance={user.performance || { easy: {}, medium: {}, hard: {} }}
//                     onLogout={handleLogout}
//                     isEvaluated={user.isEvaluated || false}
//                     onStartQuiz={handleStartQuiz}
//                 />;
//             case 'therapist-dashboard':
//                 return <TherapistDashboard user={user} onLogout={handleLogout} />;
//             case 'quiz':
//                 if (loadingQuiz) return <div>Loading Quiz...</div>;
//                 // The QuizPage component expects a specific data structure, so we recreate it here
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
//                 // Fallback for an unknown page state
//                 return <Dashboard user={user} onLogout={handleLogout} onStartQuiz={handleStartQuiz} />;
//         }
//     };

//     return <>{renderPage()}</>;
// };

// export default App;

// front_end/my-app/src/App.js

































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
//         setLoadingQuiz(true);
//         setCurrentQuizLevel(level);
//         try {
//             const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
//             setQuizQuestions(res.data);
//             setCurrentPage('quiz');
//         } catch (err) {
//             alert('Failed to load the quiz. Please make sure the backend server is running and you have seeded the database.');
//             console.error("Quiz load error:", err);
//         } finally {
//             setLoadingQuiz(false);
//         }
//     };

//     const handleQuizEnd = async () => {
//         // When the quiz ends, we want to get the freshest user data from the DB
//         // to make sure the dashboard is 100% up to date.
//         if (user && user.id) {
//             try {
//                 // We'll add a specific route for this later, for now we re-login logic
//                 // A better route would be GET /api/users/me
//                 const storedUser = localStorage.getItem('user');
//                 if (storedUser) {
//                     setUser(JSON.parse(storedUser));
//                 }
//             } catch (err) {
//                 console.error("Failed to refresh user data", err);
//             }
//         }
//         setCurrentPage('dashboard');
//         setQuizQuestions([]);
//         setCurrentQuizLevel(null);
//     };

//     // --- THIS IS THE FINAL, FULLY-FUNCTIONAL VERSION OF handleAnswer ---
//     const handleAnswer = async (isCorrect, quizLevel) => {
//         let updatedUserForAPI;

//         // Step 1: Optimistically update the state in the frontend for a fast, responsive UI.
//         setUser(prevUser => {
//             const updatedUser = JSON.parse(JSON.stringify(prevUser));
//             if (!updatedUser.performance) {
//                 updatedUser.performance = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 }};
//             }
//             if (!updatedUser.performance[quizLevel]) {
//                 updatedUser.performance[quizLevel] = { correct: 0, total: 0 };
//             }
//             updatedUser.performance[quizLevel].total += 1;

//             if (isCorrect) {
//                 updatedUser.performance[quizLevel].correct += 1;
//                 const points = quizLevel === 'easy' ? 10 : quizLevel === 'medium' ? 20 : 30;
//                 updatedUser.score = (updatedUser.score || 0) + points;
//             }
            
//             updatedUserForAPI = updatedUser; // Store the updated object to send to the API
//             return updatedUser;
//         });

//         // Step 2: Send the update to the backend to be saved permanently in the database.
//         try {
//             const body = {
//                 userId: updatedUserForAPI.id,
//                 performance: updatedUserForAPI.performance,
//                 score: updatedUserForAPI.score
//             };
            
//             // The API will save the progress and send back the confirmed, updated user object
//             const res = await axios.post('http://localhost:5000/api/users/update-progress', body);
            
//             // Step 3: Update local storage with the confirmed data from the server.
//             // This ensures progress is saved even if the user refreshes the page.
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
//                     studentPerformance={user.performance || { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } }}
//                     onLogout={handleLogout}
//                     isEvaluated={user.isEvaluated || false}
//                     onStartQuiz={handleStartQuiz}
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
















// front_end/my-app/src/App.js (Final Corrected Version)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import QuizPage from './components/QuizPage';
import TherapistDashboard from './components/TherapistDashboard';

const App = () => {
    const [currentPage, setCurrentPage] = useState('login');
    const [user, setUser] = useState(null);
    const [currentQuizLevel, setCurrentQuizLevel] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [loadingQuiz, setLoadingQuiz] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (token && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setCurrentPage(parsedUser.role === 'therapist' ? 'therapist-dashboard' : 'dashboard');
        }
    }, []);

    const handleLogin = (loggedInUser, page) => {
        setUser(loggedInUser);
        setCurrentPage(page);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentPage('login');
    };

    const handleStartQuiz = async (level) => {
        setLoadingQuiz(true);
        setCurrentQuizLevel(level);
        try {
            const res = await axios.get(`http://localhost:5000/api/quizzes/${level}`);
            setQuizQuestions(res.data);
            setCurrentPage('quiz');
        } catch (err) {
            alert('Failed to load the quiz. Please make sure the backend server is running and you have seeded the database.');
            console.error("Quiz load error:", err);
        } finally {
            setLoadingQuiz(false);
        }
    };

    const handleQuizEnd = () => {
        setCurrentPage('dashboard');
        setQuizQuestions([]);
        setCurrentQuizLevel(null);
    };

    // --- THIS IS THE FINAL, FULLY-FUNCTIONAL VERSION OF handleAnswer ---
    const handleAnswer = async (isCorrect, quizLevel) => {
        // DEFENSIVE CHECK: Make sure we have a user and a user ID before proceeding.
        if (!user || !user.id) {
            alert("User session error. Please log in again.");
            return handleLogout(); // Log out the user if their state is invalid.
        }

        let updatedPerformance;
        let updatedScore;

        // Step 1: Optimistically update the state in the frontend for a fast, responsive UI.
        setUser(prevUser => {
            const newPerformance = JSON.parse(JSON.stringify(prevUser.performance || { easy: {}, medium: {}, hard: {} }));
            
            if (!newPerformance[quizLevel]) {
                newPerformance[quizLevel] = { correct: 0, total: 0 };
            }
            newPerformance[quizLevel].total += 1;

            let newScore = prevUser.score || 0;
            if (isCorrect) {
                newPerformance[quizLevel].correct += 1;
                const points = quizLevel === 'easy' ? 10 : quizLevel === 'medium' ? 20 : 30;
                newScore += points;
            }
            
            // Store the updated parts to send to the API
            updatedPerformance = newPerformance;
            updatedScore = newScore;
            
            // Return the new state for React to render
            return { ...prevUser, performance: newPerformance, score: newScore };
        });

        // Step 2: Send the update to the backend to be saved permanently in the database.
        try {
            const body = {
                userId: user.id, // Use the original user.id from the state, which is guaranteed to be correct.
                performance: updatedPerformance,
                score: updatedScore
            };
            
            const res = await axios.post('http://localhost:5000/api/users/update-progress', body);
            
            // Step 3: Update local storage with the confirmed data from the server.
            localStorage.setItem('user', JSON.stringify(res.data));

        } catch (err) {
            console.error("Failed to save progress to the database:", err);
            // This alert is what you are seeing.
            alert("There was an error saving your progress. Please check your connection.");
        }
    };

    const renderPage = () => {
        if (!user) {
            switch (currentPage) {
                case 'signup': return <SignupPage setCurrentPage={setCurrentPage} />;
                default: return <LoginPage onLogin={handleLogin} setCurrentPage={setCurrentPage} />;
            }
        }

        switch (currentPage) {
            case 'dashboard':
                return <Dashboard
                    user={user}
                    score={user.score || 0}
                    hearts={3}
                    studentPerformance={user.performance || { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } }}
                    onLogout={handleLogout}
                    isEvaluated={user.isEvaluated || false}
                    onStartQuiz={handleStartQuiz}
                />;
            case 'therapist-dashboard':
                return <TherapistDashboard user={user} onLogout={handleLogout} />;
            case 'quiz':
                if (loadingQuiz) return <div>Loading Quiz...</div>;
                const quizDataForPage = { [currentQuizLevel]: quizQuestions };
                return <QuizPage
                    quizData={quizDataForPage}
                    currentQuiz={currentQuizLevel}
                    score={user.score || 0}
                    hearts={3}
                    onAnswer={handleAnswer}
                    onQuizEnd={handleQuizEnd}
                />;
            default:
                return <Dashboard user={user} onLogout={handleLogout} onStartQuiz={handleStartQuiz} />;
        }
    };

    return <>{renderPage()}</>;
};

export default App;