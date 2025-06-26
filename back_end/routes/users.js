// // back_end/routes/users.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// // @route   GET /api/users/students
// // @desc    Get all student users for the therapist dashboard
// router.get('/students', async (req, res) => {
//     try {
//         // Find all users with the role 'student' and select only the fields we need, removing the password
//         const students = await User.find({ role: 'student' }).select('-password');
//         res.json(students);
//     } catch (err)
//  {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // We can add more user-related routes here later
// module.exports = router;


// back_end/routes/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/users/students
// @desc    Get all student users for the therapist dashboard
router.get('/students', async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- NEW ROUTE ADDED HERE ---
// @route   POST /api/users/update-progress
// @desc    Update a user's score and performance stats
router.post('/update-progress', async (req, res) => {
    // We get the user's ID and their new progress from the frontend
    const { userId, performance, score } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update the fields on the user document
        user.performance = performance;
        user.score = score;
        
        // This is a business logic rule: if a user has attempted the medium
        // quiz at least once, we mark them as having been evaluated.
        if (performance && performance.medium && performance.medium.total > 0) {
            user.isEvaluated = true;
        }

        // Save the updated user document to the database
        const updatedUser = await user.save();
        
        // Convert to a plain object so we can delete the password before sending
        const userToReturn = updatedUser.toObject();
        delete userToReturn.password;

        // Send the fully updated user object back to the frontend
        res.json(userToReturn);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;