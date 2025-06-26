// back_end/routes/quizzes.js
const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// @route   GET /api/quizzes/:level
// @desc    Get quiz questions for a specific level
router.get('/:level', async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ level: req.params.level });
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found for this level' });
        }
        res.json(quiz.questions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// We will add the submission route later
module.exports = router;