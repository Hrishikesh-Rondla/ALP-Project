// // back_end/routes/auth.js
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // @route   POST /api/auth/register
// // @desc    Register a new user
// router.post('/register', async (req, res) => {
//     const { name, username, password, role } = req.body;

//     try {
//         let user = await User.findOne({ username });
//         if (user) {
//             return res.status(400).json({ msg: 'Username already exists' });
//         }

//         user = new User({ name, username, password, role });

//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(password, salt);

//         await user.save();

//         const payload = { user: { id: user.id, role: user.role } };
//         jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
//             if (err) throw err;
//             res.json({ token });
//         });

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // @route   POST /api/auth/login
// // @desc    Authenticate user & get token
// router.post('/login', async (req, res) => {
//     const { username, password, loginType } = req.body; // loginType is 'student' or 'therapist'

//     try {
//         let user = await User.findOne({ username });
//         if (!user) {
//             return res.status(400).json({ msg: 'Invalid Credentials' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ msg: 'Invalid Credentials' });
//         }

//         // Check if the user's role matches the login type
//         if (user.role !== loginType) {
//              return res.status(400).json({ msg: `Please use the ${user.role} login.` });
//         }

//         const payload = { user: { id: user.id, name: user.name, role: user.role } };
//         jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
//             if (err) throw err;
//             res.json({ token, user: payload.user });
//         });

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// module.exports = router;



// back_end/routes/auth.js (Updated)





// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // @route   POST /api/auth/register
// // @desc    Register a new user (ALWAYS as a student)
// router.post('/register', async (req, res) => {
//     // We only accept name, username, and password from the request.
//     // We intentionally ignore any 'role' field for security.
//     const { name, username, password } = req.body;

//     try {
//         let user = await User.findOne({ username });
//         if (user) {
//             return res.status(400).json({ msg: 'Username already exists' });
//         }

//         // --- THIS IS THE CRITICAL CHANGE ---
//         // We hardcode the role to 'student' to prevent unauthorized therapist creation.
//         user = new User({
//             name,
//             username,
//             password,
//             role: 'student' 
//         });
//         // ------------------------------------

//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(password, salt);

//         await user.save();

//         const payload = { user: { id: user.id, role: user.role } };
//         jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
//             if (err) throw err;
//             res.json({ token });
//         });

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // @route   POST /api/auth/login
// // @desc    Authenticate user & get token
// // This part remains unchanged as it is working correctly.
// router.post('/login', async (req, res) => {
//     const { username, password, loginType } = req.body; // loginType is 'student' or 'therapist'

//     try {
//         let user = await User.findOne({ username });
//         if (!user) {
//             return res.status(400).json({ msg: 'Invalid Credentials' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ msg: 'Invalid Credentials' });
//         }

//         // Check if the user's role matches the login type
//         if (user.role !== loginType) {
//              return res.status(400).json({ msg: `Please use the ${user.role} login.` });
//         }

//         const payload = { user: { id: user.id, name: user.name, role: user.role, score: user.score, performance: user.performance, isEvaluated: user.isEvaluated } };
//         jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
//             if (err) throw err;
//             // We now send back the full user object on login
//             res.json({ token, user: payload.user });
//         });

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// module.exports = router;


// back_end/routes/auth.js (Final, Corrected Version)

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user (ALWAYS as a student)
// This route is already correct and secure. No changes needed here.
router.post('/register', async (req, res) => {
    const { name, username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'Username already exists' });
        }
        user = new User({
            name,
            username,
            password,
            role: 'student' 
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    const { username, password, loginType } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        if (user.role !== loginType) {
             return res.status(400).json({ msg: `Please use the ${user.role} login.` });
        }

        // --- THIS IS THE UPDATED SECTION ---
        // 1. Create a minimal payload for the secure JWT token.
        //    It only needs the user's ID to identify them in future requests.
        const payload = { 
            user: { 
                id: user.id 
            } 
        };

        // 2. Create a separate, detailed object with all the data the frontend needs immediately.
        const userToReturn = {
            id: user.id, // Explicitly include the 'id'
            name: user.name,
            role: user.role,
            score: user.score,
            performance: user.performance,
            isEvaluated: user.isEvaluated
        };

        // 3. Sign the JWT with the minimal payload.
        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '5h' }, 
            (err, token) => {
                if (err) throw err;
                // 4. Send back the token AND the detailed user object.
                res.json({ token, user: userToReturn });
            }
        );
        // --- END OF UPDATED SECTION ---

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;