// back_end/utils/seedDatabase.js
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
// This line makes sure the script can find your .env file from one directory up
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const quizData = {
    easy: [
        { question: "Which word sounds like 'CAT'?", options: ["BAT", "DOG", "FISH", "BIRD"], correct: 0 },
        { question: "What color is the SUN?", options: ["Blue", "Yellow", "Green", "Purple"], correct: 1 },
        { question: "How many legs does a DOG have?", options: ["2", "4", "6", "8"], correct: 1 },
        { question: "Which word sounds like 'BEE'?", options: ["CAR", "SEE", "RUN", "JUMP"], correct: 1 },
        { question: "What do we use to WRITE?", options: ["Spoon", "Pencil", "Cup", "Hat"], correct: 1 },
        { question: "Which is RED?", options: ["Grass", "Sky", "Apple", "Snow"], correct: 2 },
        { question: "Where do FISH live?", options: ["Trees", "Water", "Sky", "Cave"], correct: 1 },
        { question: "What says MOO?", options: ["Dog", "Cat", "Cow", "Bird"], correct: 2 },
        { question: "How many eyes do you have?", options: ["1", "2", "3", "4"], correct: 1 },
        { question: "Which is COLD?", options: ["Fire", "Ice", "Sun", "Oven"], correct: 1 }
    ],
    medium: [
        { question: "Which word rhymes with 'PLAY'?", options: ["WORK", "DAY", "NIGHT", "BOOK"], correct: 1 },
        { question: "What comes after Monday?", options: ["Sunday", "Tuesday", "Friday", "Wednesday"], correct: 1 },
        { question: "Which is the BIGGEST?", options: ["Mouse", "Cat", "Elephant", "Ant"], correct: 2 },
        { question: "Which word rhymes with 'NIGHT'?", options: ["DARK", "LIGHT", "MOON", "SLEEP"], correct: 1 },
        { question: "What comes before Thursday?", options: ["Friday", "Monday", "Wednesday", "Saturday"], correct: 2 },
        { question: "Which is FASTER?", options: ["Turtle", "Snail", "Rabbit", "Rock"], correct: 2 },
        { question: "Which word rhymes with 'BLUE'?", options: ["RED", "NEW", "GREEN", "COLOR"], correct: 1 },
        { question: "What season comes after Winter?", options: ["Summer", "Fall", "Spring", "Winter"], correct: 2 },
        { question: "Which is LONGER?", options: ["Ant", "Snake", "Ball", "Dot"], correct: 1 },
        { question: "Which word rhymes with 'TREE'?", options: ["PLANT", "BEE", "LEAF", "WOOD"], correct: 1 }
    ],
    hard: [
        { question: "Which word has the SAME meaning as 'BIG'?", options: ["Small", "Large", "Tiny", "Little"], correct: 1 },
        { question: "What is 5 + 3?", options: ["6", "7", "8", "9"], correct: 2 },
        { question: "Which word is spelled correctly?", options: ["FREND", "FRIEND", "FREIND", "FRIND"], correct: 1 },
        { question: "Which word means the OPPOSITE of 'HOT'?", options: ["Warm", "Cool", "Fire", "Burn"], correct: 1 },
        { question: "What is 12 - 4?", options: ["6", "7", "8", "9"], correct: 2 },
        { question: "Which word is spelled correctly?", options: ["BECAUS", "BECAUSE", "BECUASE", "BECASE"], correct: 1 },
        { question: "Which word means the SAME as 'HAPPY'?", options: ["Sad", "Angry", "Joyful", "Tired"], correct: 2 },
        { question: "What is 6 × 2?", options: ["10", "11", "12", "13"], correct: 2 },
        { question: "Which word is spelled correctly?", options: ["SEPERATE", "SEPARATE", "SEPERETE", "SEPARETE"], correct: 1 },
        { question: "Which word means the OPPOSITE of 'FAST'?", options: ["Quick", "Slow", "Run", "Speed"], correct: 1 }
    ]
};

const seedDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');
    await Quiz.deleteMany({});
    console.log('Old quizzes deleted.');
    const quizzesToInsert = Object.keys(quizData).map(level => ({
        level: level,
        questions: quizData[level].map(({ type, ...rest }) => rest) // Removes the "type" field
    }));
    await Quiz.insertMany(quizzesToInsert);
    console.log('Quiz data has been successfully inserted!');
    mongoose.disconnect();
};

seedDB().catch(err => {
    console.error('Seeding failed:', err);
    mongoose.disconnect();
});