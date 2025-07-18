// // src/components/StudentDetailPage.js (New File)

// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
// import { Pie } from 'react-chartjs-2';
// import { ArrowLeft, User, PieChart, Activity } from 'lucide-react';

// // Register the necessary components for Chart.js
// ChartJS.register(ArcElement, Tooltip, Legend, Title);

// // A helper component to render a single pie chart
// const EmotionPieChart = ({ title, emotionData }) => {
//     // If no emotion data exists for this level, show a message
//     if (!emotionData || Object.keys(emotionData).length === 0) {
//         return (
//             <div className="text-center p-4 bg-light rounded-3">
//                 <p className="fw-bold">{title}</p>
//                 <p className="text-muted">No emotion data recorded yet.</p>
//             </div>
//         );
//     }

//     const labels = Object.keys(emotionData);
//     const dataValues = Object.values(emotionData);

//     const data = {
//         labels: labels,
//         datasets: [{
//             label: '# of Times Recorded',
//             data: dataValues,
//             backgroundColor: [ // Add more colors if you have more emotions
//                 'rgba(75, 192, 192, 0.6)',
//                 'rgba(255, 99, 132, 0.6)',
//                 'rgba(255, 206, 86, 0.6)',
//                 'rgba(54, 162, 235, 0.6)',
//                 'rgba(153, 102, 255, 0.6)',
//                 'rgba(255, 159, 64, 0.6)',
//             ],
//             borderColor: [
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)',
//             ],
//             borderWidth: 1,
//         }],
//     };

//     return (
//         <div className="p-3">
//             <Pie
//                 data={data}
//                 options={{
//                     responsive: true,
//                     plugins: {
//                         legend: { position: 'top' },
//                         title: { display: true, text: title, font: { size: 16 } },
//                     },
//                 }}
//             />
//         </div>
//     );
// };


// const StudentDetailPage = () => {
//     const { studentId } = useParams(); // Get the student's ID from the URL
//     const [student, setStudent] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchStudentData = async () => {
//             try {
//                 // This is a NEW API endpoint we need to create in the backend
//                 const res = await axios.get(`http://localhost:5000/api/users/${studentId}`);
//                 setStudent(res.data);
//             } catch (err) {
//                 setError('Failed to fetch student data.');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchStudentData();
//     }, [studentId]);

//     if (loading) return <div className="p-5 text-center"><h2>Loading...</h2></div>;
//     if (error) return <div className="p-5 text-center"><h2 className="text-danger">{error}</h2></div>;
//     if (!student) return <div className="p-5 text-center"><h2>Student not found.</h2></div>;

//     return (
//         <div className="min-vh-100 bg-light p-3 p-lg-4">
//             <div className="container-xl">
//                 {/* Header with Back Button */}
//                 <div className="d-flex justify-content-start mb-4">
//                     <Link to="/therapist-dashboard" className="btn btn-secondary d-flex align-items-center">
//                         <ArrowLeft size={18} className="me-2" /> Back to Dashboard
//                     </Link>
//                 </div>

//                 {/* Student Info Card */}
//                 <div className="card shadow-sm rounded-4 mb-4">
//                     <div className="card-body p-4">
//                         <div className="d-flex align-items-center">
//                             <div className="icon-circle bg-gradient-purple-pink me-3"><User size={28} /></div>
//                             <div>
//                                 <h1 className="h4 fw-bold text-dark mb-0">{student.name}</h1>
//                                 <p className="text-muted mb-0">@{student.username} | Total Score: {student.score}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Emotion Charts Card */}
//                 <div className="card shadow-sm rounded-4">
//                      <div className="card-header bg-white border-0 pt-3 d-flex align-items-center">
//                         <PieChart size={24} className="me-2 text-primary" />
//                         <h2 className="h5 fw-bold text-dark mb-0">Emotion Analysis During Quizzes</h2>
//                     </div>
//                     <div className="card-body">
//                         <div className="row">
//                             <div className="col-md-4">
//                                 <EmotionPieChart title="Easy Level Emotions" emotionData={student.emotionData?.easy} />
//                             </div>
//                             <div className="col-md-4">
//                                 <EmotionPieChart title="Medium Level Emotions" emotionData={student.emotionData?.medium} />
//                             </div>
//                             <div className="col-md-4">
//                                 <EmotionPieChart title="Hard Level Emotions" emotionData={student.emotionData?.hard} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* You could add another card here for detailed quiz performance */}

//             </div>
//         </div>
//     );
// };

// export default StudentDetailPage;

// frontend/src/components/StudentDetailPage.js (DEFINITIVE, SECURE VERSION)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ArrowLeft, User, PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const EmotionPieChart = ({ title, emotionData }) => {
    if (!emotionData || Object.keys(emotionData).length === 0) {
        return (
            <div className="text-center p-4 rounded-3" style={{ backgroundColor: 'var(--background-page)' }}>
                <p className="fw-bold" style={{ color: 'var(--text-primary)' }}>{title}</p>
                <p style={{ color: 'var(--text-secondary)' }}>No emotion data recorded yet.</p>
            </div>
        );
    }
    const labels = Object.keys(emotionData);
    const dataValues = Object.values(emotionData);
    const data = {
        labels: labels,
        datasets: [{
            label: '# of Detections',
            data: dataValues,
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(100, 100, 100, 0.6)'],
            borderColor: ['#fff'],
            borderWidth: 2,
        }],
    };
    return (
        <div className="p-3">
            <Pie data={data} options={{ responsive: true, plugins: { legend: { position: 'top', labels: { color: 'var(--text-secondary)' } }, title: { display: true, text: title, font: { size: 16 }, color: 'var(--text-primary)' } } }} />
        </div>
    );
};


const StudentDetailPage = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;
        const fetchStudentData = async () => {
            // --- THIS IS THE FIX ---
            // We get the token from localStorage to prove we are authorized.
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication error. Please log in.');
                setLoading(false);
                return;
            }

            // Create the headers object to send the token.
            const config = {
                headers: {
                    'x-auth-token': token,
                },
            };

            try {
                // Send the request WITH the authentication headers.
                const res = await axios.get(`http://localhost:5000/api/users/${studentId}`, config);
                if (isMounted) {
                    setStudent(res.data);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to fetch student data.');
                }
                console.error(err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchStudentData();
        return () => { isMounted = false; };
    }, [studentId]);

    if (loading) return <div className="p-5 text-center" style={{ color: 'var(--text-primary)' }}><h2>Loading Student Data...</h2></div>;
    if (error) return <div className="p-5 text-center"><h2 className="text-danger">{error}</h2></div>;
    if (!student) return <div className="p-5 text-center" style={{ color: 'var(--text-primary)' }}><h2>Student not found.</h2></div>;

    return (
        <div className="min-vh-100 p-3 p-lg-4" style={{ backgroundColor: 'var(--background-page)' }}>
            <div className="container-xl">
                <div className="d-flex justify-content-start mb-4">
                    <Link to="/therapist-dashboard" className="btn btn-secondary d-flex align-items-center"><ArrowLeft size={18} className="me-2" /> Back to Dashboard</Link>
                </div>
                <div className="card shadow-sm rounded-4 mb-4">
                    <div className="card-body p-4"><div className="d-flex align-items-center">
                        <div className="icon-circle bg-primary text-white me-3"><User size={28} /></div>
                        <div>
                            <h1 className="h4 fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>{student.name}</h1>
                            <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>@{student.username} | Total Score: {student.score}</p>
                        </div>
                    </div></div>
                </div>
                <div className="card shadow-sm rounded-4">
                    <div className="card-header bg-transparent border-0 pt-4 d-flex align-items-center">
                        <PieChart size={24} className="me-2 text-primary" />
                        <h2 className="h5 fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Emotion Analysis During Quizzes</h2>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-4"><EmotionPieChart title="Easy Level Emotions" emotionData={student.emotionData?.easy} /></div>
                            <div className="col-lg-4"><EmotionPieChart title="Medium Level Emotions" emotionData={student.emotionData?.medium} /></div>
                            <div className="col-lg-4"><EmotionPieChart title="Hard Level Emotions" emotionData={student.emotionData?.hard} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailPage;