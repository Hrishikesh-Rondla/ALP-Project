// // backend/stats/dashboard.js

// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// // @route   GET /api/stats/dashboard
// // @desc    Get dashboard stats like top performers and students for review
// router.get('/', async (req, res) => {
//     try {
//         const students = await User.find({ role: 'student' }).select('-password');

//         // 1. Get Top 3 Performers (by score)
//         const topPerformers = [...students] // Create a copy
//             .sort((a, b) => b.score - a.score) // Sort by score descending
//             .slice(0, 3); // Take the top 3

//         // 2. Get 3 Students Needing Attention (by average percentage)
//         const studentsWithAverages = students
//             .map(student => {
//                 const perf = student.performance;
//                 let totalCorrect = 0;
//                 let totalQuestions = 0;

//                 if (perf.easy) { totalCorrect += perf.easy.correct; totalQuestions += perf.easy.total; }
//                 if (perf.medium) { totalCorrect += perf.medium.correct; totalQuestions += perf.medium.total; }
//                 if (perf.hard) { totalCorrect += perf.hard.correct; totalQuestions += perf.hard.total; }

//                 // Avoid division by zero, students with no attempts have an avg of -1
//                 const average = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : -1;

//                 return { ...student.toObject(), average: Math.round(average) };
//             })
//             .filter(student => student.average !== -1); // Filter out those who haven't played

//         const studentsForReview = studentsWithAverages
//             .sort((a, b) => a.average - b.average) // Sort by average ascending
//             .slice(0, 3); // Take the bottom 3

//         res.json({
//             topPerformers,
//             studentsForReview
//         });

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// module.exports = router;

// backend/stats/dashboard.js (UPGRADED)

// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// router.get('/', async (req, res) => {
//     try {
//         const students = await User.find({ role: 'student' }).select('-password');

//         // --- Calculation logic for Top Performers and Students for Review (unchanged) ---
//         const topPerformers = [...students]
//             .sort((a, b) => b.score - a.score)
//             .slice(0, 3);

//         const studentsWithAverages = students
//             .map(student => {
//                 const perf = student.performance;
//                 let totalCorrect = 0;
//                 let totalQuestions = 0;
//                 if (perf.easy) { totalCorrect += perf.easy.correct; totalQuestions += perf.easy.total; }
//                 if (perf.medium) { totalCorrect += perf.medium.correct; totalQuestions += perf.medium.total; }
//                 if (perf.hard) { totalCorrect += perf.hard.correct; totalQuestions += perf.hard.total; }
//                 const average = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : -1;
//                 return { ...student.toObject(), average: Math.round(average) };
//             })
//             .filter(student => student.average !== -1);

//         const studentsForReview = studentsWithAverages
//             .sort((a, b) => a.average - b.average)
//             .slice(0, 3);
            
//         // --- NEW: Calculate the overall class average for the gauge chart ---
//         const totalAverage = studentsWithAverages.length > 0
//             ? Math.round(studentsWithAverages.reduce((acc, s) => acc + s.average, 0) / studentsWithAverages.length)
//             : 0;

//         // --- Send all stats back to the front-end ---
//         res.json({
//             topPerformers,
//             studentsForReview,
//             classAverage: totalAverage, // Add the new stat here
//             totalStudentCount: students.length
//         });

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// module.exports = router;

// backend/stats/dashboard.js (SIMPLIFIED)

// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// router.get('/', async (req, res) => {
//     try {
//         const students = await User.find({ role: 'student' }).select('-password');

//         const topPerformers = [...students].sort((a, b) => b.score - a.score).slice(0, 3);

//         const studentsWithAverages = students
//             .map(student => {
//                 const perf = student.performance;
//                 let totalCorrect = 0;
//                 let totalQuestions = 0;
//                 if (perf.easy) { totalCorrect += perf.easy.correct; totalQuestions += perf.easy.total; }
//                 if (perf.medium) { totalCorrect += perf.medium.correct; totalQuestions += perf.medium.total; }
//                 if (perf.hard) { totalCorrect += perf.hard.correct; totalQuestions += perf.hard.total; }
//                 const average = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : -1;
//                 return { ...student.toObject(), average };
//             })
//             .filter(student => student.average !== -1);

//         const studentsForReview = studentsWithAverages.sort((a, b) => a.average - b.average).slice(0, 3);
            
//         res.json({
//             topPerformers,
//             studentsForReview,
//             totalStudentCount: students.length
//         });

//     } catch (err) {
//         res.status(500).send('Server Error');
//     }
// });

// module.exports = router;


// backend/stats/dashboard.js (DEFINITIVE, WORKING VERSION)

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/stats/dashboard
// @desc    Get dashboard stats like student count, top performers, and students for review
router.get('/', async (req, res) => {
    try {
        // Fetch all students from the database, excluding their passwords
        const students = await User.find({ role: 'student' }).select('-password');

        // 1. Get Total Student Count
        const totalStudentCount = students.length;

        // 2. Get Top 3 Performers (sorted by highest score)
        const topPerformers = [...students] // Create a copy to avoid modifying the original array
            .sort((a, b) => b.score - a.score) // Sort in descending order of score
            .slice(0, 3); // Take only the first 3

        // 3. Get 3 Students Needing Attention (sorted by lowest average performance)
        const studentsWithAverages = students
            .map(student => {
                const perf = student.performance;
                let totalCorrect = 0;
                let totalQuestions = 0;

                // Sum up scores from all quiz levels
                if (perf.easy && perf.easy.total > 0) { totalCorrect += perf.easy.correct; totalQuestions += perf.easy.total; }
                if (perf.medium && perf.medium.total > 0) { totalCorrect += perf.medium.correct; totalQuestions += perf.medium.total; }
                if (perf.hard && perf.hard.total > 0) { totalCorrect += perf.hard.correct; totalQuestions += perf.hard.total; }

                // Calculate average, handle case where student has not attempted any quizzes to avoid division by zero
                const average = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : -1;

                // Return a new object with the student data and their calculated average
                return { ...student.toObject(), average };
            })
            .filter(student => student.average !== -1); // Filter out students who haven't played

        const studentsForReview = studentsWithAverages
            .sort((a, b) => a.average - b.average) // Sort in ascending order of average score
            .slice(0, 3); // Take only the first 3 (the lowest scores)

        // Send all the calculated stats back to the front-end in a single JSON object
        res.json({
            totalStudentCount,
            topPerformers,
            studentsForReview
        });

    } catch (err) {
        console.error("Error in dashboard stats route:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;