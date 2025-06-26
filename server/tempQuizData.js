// This data will eventually move into your database, but for now, it's served from the backend.
const quizData = {
    easy: [
        {
            question: "What is the color of the sky on a clear day?",
            options: ["Green", "Blue", "Red", "Yellow"],
            correct: 1,
        },
        {
            question: "How many legs does a spider have?",
            options: ["6", "8", "10", "4"],
            correct: 1,
        },
        {
            question: "Which of these is a primary color?",
            options: ["Orange", "Green", "Purple", "Red"],
            correct: 3,
        },
        {
            question: "What sound does a cat make?",
            options: ["Woof", "Moo", "Meow", "Oink"],
            correct: 2,
        },
        {
            question: "What is 5 + 5?",
            options: ["8", "9", "10", "11"],
            correct: 2,
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Earth", "Mars", "Jupiter", "Venus"],
            correct: 1,
        },
        {
            question: "What do bees make?",
            options: ["Milk", "Silk", "Honey", "Bread"],
            correct: 2,
        },
        {
            question: "What is the opposite of 'hot'?",
            options: ["Warm", "Cold", "Spicy", "Sunny"],
            correct: 1,
        },
        {
            question: "Which of these animals can fly?",
            options: ["Pig", "Dog", "Bird", "Fish"],
            correct: 2,
        },
        {
            question: "What is the first letter of the alphabet?",
            options: ["C", "B", "A", "D"],
            correct: 2,
        },
    ],
    medium: [
        {
            question: "What is the capital of Japan?",
            options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
            correct: 2,
        },
        {
            question: "Which is the largest planet in our solar system?",
            options: ["Earth", "Saturn", "Jupiter", "Neptune"],
            correct: 2,
        },
        {
            question: "Who wrote the play 'Romeo and Juliet'?",
            options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
            correct: 1,
        },
        {
            question: "What is H2O also known as?",
            options: ["Salt", "Sugar", "Air", "Water"],
            correct: 3,
        },
        {
            question: "How many continents are there in the world?",
            options: ["5", "6", "7", "8"],
            correct: 2,
        },
        {
            question: "What is the main ingredient in guacamole?",
            options: ["Tomato", "Avocado", "Onion", "Pepper"],
            correct: 1,
        },
        {
            question: "Which is the longest river in the world?",
            options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
            correct: 1,
        },
        {
            question: "What currency is used in the United Kingdom?",
            options: ["Euro", "Dollar", "Pound Sterling", "Yen"],
            correct: 2,
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
            correct: 2,
        },
        {
            question: "In which country would you find the Eiffel Tower?",
            options: ["Italy", "Spain", "Germany", "France"],
            correct: 3,
        },
    ],
    hard: [
        {
            question: "What is the chemical symbol for Gold?",
            options: ["Ag", "Go", "Au", "Gd"],
            correct: 2,
        },
        {
            question: "In what year did the Titanic sink?",
            options: ["1905", "1912", "1918", "1923"],
            correct: 1,
        },
        {
            question: "Who developed the theory of relativity?",
            options: ["Isaac Newton", "Galileo Galilei", "Nikola Tesla", "Albert Einstein"],
            correct: 3,
        },
        {
            question: "What is the hardest natural substance on Earth?",
            options: ["Gold", "Iron", "Diamond", "Quartz"],
            correct: 2,
        },
        {
            question: "Which philosopher is known for the quote 'I think, therefore I am'?",
            options: ["Plato", "Socrates", "Aristotle", "René Descartes"],
            correct: 3,
        },
        {
            question: "What is the capital city of Australia?",
            options: ["Sydney", "Melbourne", "Canberra", "Perth"],
            correct: 2,
        },
        {
            question: "How many bones are in the adult human body?",
            options: ["206", "212", "198", "220"],
            correct: 0,
        },
        {
            question: "Which two planets in our solar system are known as 'ice giants'?",
            options: ["Jupiter and Saturn", "Uranus and Neptune", "Mars and Venus", "Pluto and Eris"],
            correct: 1,
        },
        {
            question: "The ancient city of Rome was built on how many hills?",
            options: ["Five", "Seven", "Nine", "Three"],
            correct: 1,
        },
        {
            question: "What is the study of mushrooms called?",
            options: ["Mycology", "Botany", "Zoology", "Geology"],
            correct: 0,
        },
    ],
};

module.exports = { quizData };