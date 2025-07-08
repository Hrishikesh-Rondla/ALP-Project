// back_end/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'therapist', 'superadmin'], required: true, index: true },

    therapistStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: null,
        index: true
    },

    isEvaluated: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    performance: {
        easy: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
        medium: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
        hard: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } }
    },
    emotionData: {
        type: {
            easy: { type: Map, of: Number, default: new Map() },
            medium: { type: Map, of: Number, default: new Map() },
            hard: { type: Map, of: Number, default: new Map() }
        },
        default: () => ({ easy: new Map(), medium: new Map(), hard: new Map() })
    },
    joinDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);