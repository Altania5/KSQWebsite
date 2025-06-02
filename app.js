// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));


const feedbackRoutes = require('./routes/feedback');
app.use('/feedback', feedbackRoutes); 

// Basic Route
app.get('/', (req, res) => {
  res.redirect('/feedback'); // Redirect to feedback page by default
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});