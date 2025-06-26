const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const QuizResult = require('../models/QuizResult');

// @route   GET /api/users/student-performance
// @desc    Get all student data and their quiz results for the therapist dashboard
// @access  Private (therapist only)
router.get('/student-performance', auth, async (req, res) => {
    // 1. Check if the logged-in user is a therapist
    if (req.user.role !== 'therapist') {
        return res.status(403).json({ msg: 'Access denied: requires therapist role.' });
    }

    try {
        // 2. Fetch all users with the role 'student'
        //    .lean() makes the query faster as it returns plain JS objects
        const students = await User.find({ role: 'student' }).select('-password').lean();

        // 3. For each student, fetch all their quiz results
        const performanceData = await Promise.all(students.map(async (student) => {
            const results = await QuizResult.find({ userId: student._id }).sort({ createdAt: -1 });
            return {
                ...student, // Spread student info (id, name, username)
                results     // Attach an array of their quiz results
            };
        }));

        res.json(performanceData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;