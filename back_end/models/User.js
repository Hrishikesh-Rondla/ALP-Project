// back_end/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'therapist'], default: 'student' ,index: true},
    isEvaluated: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    performance: {
        easy: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
        medium: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
        hard: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } }
    },
    joinDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);