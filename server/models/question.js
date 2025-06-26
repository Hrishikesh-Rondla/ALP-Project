const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    level: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct: { type: Number, required: true }
});

module.exports = mongoose.model('Question', QuestionSchema);