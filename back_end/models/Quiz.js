// back_end/models/Quiz.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correct: Number
});

const QuizSchema = new mongoose.Schema({
    level: {
        type: String,
        required: true,
        unique: true,
        enum: ['easy', 'medium', 'hard']
    },
    questions: [QuestionSchema]
});

module.exports = mongoose.model('Quiz', QuizSchema);