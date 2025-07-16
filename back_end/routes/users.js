



// // backend/routes/users.js (FINAL, WITH EMOTION SAVING)

// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// // GET /api/users/students (This route is fine and unchanged)
// router.get('/students', async (req, res) => {
//     try {
//         const students = await User.find({ role: 'student' }).select('-password');
//         res.json(students);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // GET /api/users/:id (This route is fine and unchanged)
// router.get('/:id', async (req, res) => {
//     try {
//         const student = await User.findById(req.params.id).select('-password');
//         if (!student) return res.status(404).json({ msg: 'Student not found' });
//         if (student.role !== 'student') return res.status(403).json({ msg: 'User is not a student' });
//         res.json(student);
//     } catch (err) {
//         if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Student not found' });
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // --- MODIFIED: This route now correctly receives and saves the emotion tally ---
// router.post('/update-progress', async (req, res) => {
//     const { userId, performance, score, quizLevel, emotionTally } = req.body;

//     if (!userId || !performance || typeof score === 'undefined' || !quizLevel || !emotionTally) {
//         return res.status(400).json({ msg: 'Missing required data for progress update.' });
//     }

//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ msg: 'User not found' });
//         }

//         user.performance = performance;
//         user.score = score;
//         if (performance?.medium?.total > 0) {
//             user.isEvaluated = true;
//         }

//         // --- NEW LOGIC: Merge the new emotion counts into the database ---
//         if (!user.emotionData) {
//             user.emotionData = { easy: new Map(), medium: new Map(), hard: new Map() };
//         }
//         const levelEmotions = user.emotionData[quizLevel];
//         if (levelEmotions) {
//             for (const [emotion, count] of Object.entries(emotionTally)) {
//                 const existingCount = levelEmotions.get(emotion) || 0;
//                 levelEmotions.set(emotion, existingCount + count);
//             }
//         }
        
//         const updatedUser = await user.save();

//         const userToReturn = updatedUser.toObject();
//         delete userToReturn.password;
//         res.json(userToReturn);

//     } catch (err) {
//         console.error("CRITICAL ERROR in /update-progress:", err);
//         res.status(500).send('Server Error');
//     }
// });

// module.exports = router;


// backend/routes/users.js (FINAL - OVERWRITE EMOTIONS)

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users/students (This route is fine and unchanged)
router.get('/students', async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET /api/users/:id (This route is fine and unchanged)
router.get('/:id', async (req, res) => {
    try {
        const student = await User.findById(req.params.id).select('-password');
        if (!student) return res.status(404).json({ msg: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- MODIFIED: This route now OVERWRITES the emotion data ---
router.post('/update-progress', async (req, res) => {
    const { userId, performance, score, quizLevel, emotionTally } = req.body;

    if (!userId || !performance || typeof score === 'undefined' || !quizLevel || !emotionTally) {
        return res.status(400).json({ msg: 'Missing required data.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // --- THE KEY CHANGE IS HERE ---
        // Instead of merging, we will replace the data for the specific quiz level
        // This ensures the pie chart only shows the most recent attempt.
        user.performance[quizLevel] = performance[quizLevel];
        user.emotionData[quizLevel] = emotionTally;
        
        // We still need to recalculate the total score
        let totalScore = 0;
        if (user.performance.easy) totalScore += user.performance.easy.correct * 10;
        if (user.performance.medium) totalScore += user.performance.medium.correct * 10;
        if (user.performance.hard) totalScore += user.performance.hard.correct * 10;
        user.score = totalScore;
        
        // Set evaluation status
        if (performance?.medium?.total > 0) {
            user.isEvaluated = true;
        }

        // This ensures Mongoose knows that the nested object has changed
        user.markModified('performance');
        user.markModified('emotionData');

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