const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Register a new user (student or therapist)
router.post('/register', async (req, res) => {
    const { name, username, password, role } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, username, password, role });
        await user.save();

        const payload = { user: { id: user.id, name: user.name, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token, user: payload.user });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Login for an existing user
router.post('/login', async (req, res) => {
    const { username, password, loginType } = req.body;
    try {
        const user = await User.findOne({ username, role: loginType });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: user.id, name: user.name, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: payload.user });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;