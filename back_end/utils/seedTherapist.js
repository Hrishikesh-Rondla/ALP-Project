// back_end/utils/seedTherapist.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// --- DEFINE YOUR ONE THERAPIST'S CREDENTIALS HERE ---
const THERAPIST_USERNAME = "therapist123";
const THERAPIST_PASSWORD = "secure2024";
const THERAPIST_NAME = "Dr. Alex Ray";
// ----------------------------------------------------

const seedTherapist = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for therapist check...');

        // 1. Check if a therapist already exists
        const existingTherapist = await User.findOne({ role: 'therapist' });

        if (existingTherapist) {
            console.log('Therapist account already exists. No action taken.');
            mongoose.disconnect();
            return;
        }

        // 2. If no therapist exists, create one.
        console.log('No therapist found. Creating a new one...');
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(THERAPIST_PASSWORD, salt);

        const newTherapist = new User({
            name: THERAPIST_NAME,
            username: THERAPIST_USERNAME,
            password: hashedPassword,
            role: 'therapist'
        });

        await newTherapist.save();
        console.log(`Successfully created therapist account for username: ${THERAPIST_USERNAME}`);

    } catch (error) {
        console.error('Error seeding therapist:', error);
    } finally {
        mongoose.disconnect();
    }
};

seedTherapist();