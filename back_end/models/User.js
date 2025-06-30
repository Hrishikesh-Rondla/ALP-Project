

// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     name: { type: String, required: true, trim: true },
//     username: { type: String, required: true, unique: true, trim: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ['student', 'therapist'], default: 'student', index: true },
//     isEvaluated: { type: Boolean, default: false },
//     score: { type: Number, default: 0 },
//     performance: {
//         easy: {
//             correct: { type: Number, default: 0 },
//             total: { type: Number, default: 0 }
//         },
//         medium: {
//             correct: { type: Number, default: 0 },
//             total: { type: Number, default: 0 }
//         },
//         hard: {
//             correct: { type: Number, default: 0 },
//             total: { type: Number, default: 0 }
//         }
//     },
    
//     // --- NEW SECTION TO STORE EMOTION DATA ---
//     // This will store data like: { easy: { 'happy': 5, 'sad': 2 }, medium: { 'neutral': 10 } }
//     emotionData: {
//         easy: {
//             type: Map,
//             of: Number, // The value of each map entry will be a number (the count)
//             default: {}
//         },
//         medium: {
//             type: Map,
//             of: Number,
//             default: {}
//         },
//         hard: {
//             type: Map,
//             of: Number,
//             default: {}
//         }
//     },
//     // --- END OF NEW SECTION ---

//     joinDate: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('User', UserSchema);

// back_end/models/User.js (Definitive Final Version)

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'therapist'], default: 'student', index: true },
    isEvaluated: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    performance: {
        easy: {
            correct: { type: Number, default: 0 },
            total: { type: Number, default: 0 }
        },
        medium: {
            correct: { type: Number, default: 0 },
            total: { type: Number, default: 0 }
        },
        hard: {
            correct: { type: Number, default: 0 },
            total: { type: Number, default: 0 }
        }
    },
    
    // --- THIS IS THE CORRECTED SCHEMA DEFINITION ---
    // This structure guarantees that emotionData and its nested maps are created for every new user.
    emotionData: {
        type: {
            easy: { type: Map, of: Number, default: new Map() },
            medium: { type: Map, of: Number, default: new Map() },
            hard: { type: Map, of: Number, default: new Map() }
        },
        // This default function ensures the entire emotionData object is created when a new user signs up.
        default: () => ({
            easy: new Map(),
            medium: new Map(),
            hard: new Map()
        })
    },
    // --- END OF CORRECTED SECTION ---

    joinDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);