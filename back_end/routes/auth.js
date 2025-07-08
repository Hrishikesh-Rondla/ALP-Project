// back_end/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This route for STUDENTS remains unchanged.
router.post('/register', async (req, res) => {
    const { name, username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'Username already exists' });
        user = new User({ name, username, password, role: 'student' });
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

// NEW route for therapists to apply.
router.post('/register-therapist', async (req, res) => {
    const { name, username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'Username already exists' });
        user = new User({ name, username, password, role: 'therapist', therapistStatus: 'pending' });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.json({ msg: 'Application submitted successfully. You can log in once approved by an admin.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// MODIFIED login route to handle all roles.
router.post('/login', async (req, res) => {
    const { username, password, loginType } = req.body;

    // Handle Super Admin Login
    if (loginType === 'superadmin') {
        if (username === process.env.SUPERADMIN_USERNAME && password === process.env.SUPERADMIN_PASSWORD) {
            const payload = { user: { id: 'superadmin', role: 'superadmin' } };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
            return res.json({ token, user: { name: 'Super Admin', role: 'superadmin' } });
        } else {
            return res.status(400).json({ msg: 'Invalid Super Admin Credentials' });
        }
    }

    // Handle Student/Therapist Login
    try {
        let user = await User.findOne({ username });
        if (!user || user.role !== loginType) return res.status(400).json({ msg: 'Invalid Credentials' });
        if (user.role === 'therapist' && user.therapistStatus !== 'approved') return res.status(403).json({ msg: 'Your account is pending approval.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };
        const userToReturn = { id: user.id, name: user.name, role: user.role, score: user.score, performance: user.performance, isEvaluated: user.isEvaluated };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: userToReturn });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;