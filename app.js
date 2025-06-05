// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const PageView = require('./models/PageView');
const path = require('path');

const { trackFeedbackPageView } = require('./middleware/trackViews');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const port = process.env.PORT || 3000;
const feedbackRoutes = require('./routes/feedback');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/feedback', trackFeedbackPageView, feedbackRoutes);

app.use(session({
    secret: 'ksqtaylor2025',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Basic Route
app.get('/', (req, res) => {
  res.redirect('/feedback');
});

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});