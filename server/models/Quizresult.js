const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    level: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    correctAnswers: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    score: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

// THE FIX: Check if the model already exists before compiling it.
module.exports = mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema);