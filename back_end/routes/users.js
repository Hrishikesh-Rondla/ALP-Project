

// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// // @route   GET /api/users/students
// // @desc    Get all student users for the therapist dashboard
// router.get('/students', async (req, res) => {
//     try {
//         const students = await User.find({ role: 'student' }).select('-password');
//         res.json(students);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // --- NEW ROUTE FOR STUDENT DETAIL PAGE ---
// // @route   GET /api/users/:id
// // @desc    Get a single student's data by their ID
// router.get('/:id', async (req, res) => {
//     try {
//         const student = await User.findById(req.params.id).select('-password');
        
//         if (!student) {
//             return res.status(404).json({ msg: 'Student not found' });
//         }
//         // Ensure the student being requested is actually a student
//         if (student.role !== 'student') {
//             return res.status(403).json({ msg: 'User is not a student' });
//         }

//         res.json(student);

//     } catch (err) {
//         // This handles cases where the ID format is invalid (e.g., not a valid MongoDB ObjectId)
//         if (err.kind === 'ObjectId') {
//             return res.status(404).json({ msg: 'Student not found' });
//         }
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });
// --- END OF NEW ROUTE ---


// @route   POST /api/users/update-progress
// @desc    Update a user's score, performance, AND emotion data
// router.post('/update-progress', async (req, res) => {

//     console.log("DEBUG: Backend received this data --->", req.body);
//     const { userId, performance, score, emotion, quizLevel } = req.body;

//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ msg: 'User not found' });
//         }

//         user.performance = performance;
//         user.score = score;
        
//         if (emotion && quizLevel && user.emotionData.get(quizLevel)) {
//             const currentCount = user.emotionData.get(quizLevel).get(emotion) || 0;
//             user.emotionData.get(quizLevel).set(emotion, currentCount + 1);
//         }

//         if (performance && performance.medium && performance.medium.total > 0) {
//             user.isEvaluated = true;
//         }

//         const updatedUser = await user.save();
        
//         const userToReturn = updatedUser.toObject();
//         delete userToReturn.password;

//         res.json(userToReturn);

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// In back_end/routes/users.js, replace the existing '/update-progress' route with this one.

// In back_end/routes/users.js, replace the whole function

// In back_end/routes/users.js, replace the whole function

// back_end/routes/users.js (Definitive Final Version)

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users/students (This route is fine)
router.get('/students', async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/users/:id (This route is fine)
router.get('/:id', async (req, res) => {
    try {
        const student = await User.findById(req.params.id).select('-password');
        if (!student) return res.status(404).json({ msg: 'Student not found' });
        if (student.role !== 'student') return res.status(403).json({ msg: 'User is not a student' });
        res.json(student);
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Student not found' });
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// POST /api/users/update-progress (This logic is now simpler and safer)
router.post('/update-progress', async (req, res) => {
    const { userId, performance, score, emotion, quizLevel } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update standard fields
        user.performance = performance;
        user.score = score;
        
        // Update emotion data - this is now safe because the model guarantees the fields exist
        if (emotion && quizLevel && user.emotionData && user.emotionData[quizLevel]) {
            const currentCount = user.emotionData[quizLevel].get(emotion) || 0;
            user.emotionData[quizLevel].set(emotion, currentCount + 1);
        }
        
        if (performance?.medium?.total > 0) {
            user.isEvaluated = true;
        }

        const updatedUser = await user.save();
        
        const userToReturn = updatedUser.toObject();
        delete userToReturn.password;
        res.json(userToReturn);

    } catch (err) {
        console.error("CRITICAL ERROR in /update-progress:", err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;