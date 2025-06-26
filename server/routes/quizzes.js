const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Question = require('../models/question'); // Use the Question model
const QuizResult = require('../models/Quizresult');

// Fetch 10 random questions for a level from the database
router.get('/:level', auth, async (req, res) => {
    try {
        const questions = await Question.aggregate([
            { $match: { level: req.params.level } },
            { $sample: { size: 10 } }
        ]);
        if (questions.length < 1) { // Can be less than 10 if not enough questions exist
            return res.status(404).json({ msg: 'No questions found for this level.' });
        }
        res.json(questions);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Submit quiz results (this already uses the database)
router.post('/submit', auth, async (req, res) => {
    const { level, correctAnswers, totalQuestions, score } = req.body;
    try {
        const newResult = new QuizResult({ userId: req.user.id, level, correctAnswers, totalQuestions, score });
        await newResult.save();
        res.status(201).json({ msg: "Result saved successfully" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;