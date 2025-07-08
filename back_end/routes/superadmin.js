// back_end/routes/superadmin.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/superadmin/pending-therapists
router.get('/pending-therapists', async (req, res) => {
    try {
        const pendingTherapists = await User.find({ role: 'therapist', therapistStatus: 'pending' }).select('-password');
        res.json(pendingTherapists);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/superadmin/approve-therapist/:id
router.post('/approve-therapist/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'therapist') {
            return res.status(404).json({ msg: 'Therapist not found' });
        }
        user.therapistStatus = 'approved';
        await user.save();
        res.json({ msg: 'Therapist approved successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;