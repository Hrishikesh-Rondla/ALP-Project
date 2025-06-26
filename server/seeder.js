require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/question');
const { quizData } = require('./tempQuizData'); // NOTE: this will only work if quizData.js uses module.exports

// In your tempQuizData.js, make sure the last line is:
// module.exports = { quizData };
// instead of `export const quizData`

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Question.deleteMany();

        const allQuestions = [];
        for (const level in quizData) {
            quizData[level].forEach(q => {
                allQuestions.push({ ...q, level });
            });
        }

        await Question.insertMany(allQuestions);
        console.log('Data successfully imported!');
        process.exit();
    } catch (error) {
        console.error('Error with data import:', error);
        process.exit(1);
    }
};

importData();