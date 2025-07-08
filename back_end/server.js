// back_end/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
// We will add more routes later
app.use('/api/quizzes', require('./routes/quizzes'));

app.use('/api/users', require('./routes/users'));

app.use('/api/superadmin', require('./routes/superadmin'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server is running on http://localhost:${PORT}`));