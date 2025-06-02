// routes/feedback.js
const express = require('express');
const router = express.Router();
const Satisfaction = require('../models/Satisfaction'); // Import your model

// Route to display the submission form and existing feedback
router.get('/', async (req, res) => {
  try {
    const feedbackEntries = await Satisfaction.find().sort({ submittedAt: -1 }).limit(20); // Get latest 20
    res.render('feedback', { title: 'Leave Your Feedback', feedbackEntries }); // Create feedback.ejs
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching feedback.");
  }
});

// Route to handle new feedback submission
router.post('/submit', async (req, res) => {
  const { level, comment } = req.body;

  if (!level) {
    return res.status(400).send('Satisfaction level is required.');
  }

  try {
    const newSatisfaction = new Satisfaction({
      level: parseInt(level),
      comment: comment
    });
    await newSatisfaction.save();
    res.redirect('/feedback'); // Redirect back to the feedback page
  } catch (err) {
    console.error(err);
    res.status(500).send("Error submitting feedback.");
  }
});

module.exports = router;