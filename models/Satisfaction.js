// models/Satisfaction.js
const mongoose = require('mongoose');

const satisfactionSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
    min: 1, // e.g., 1 for very unsatisfied
    max: 5  // e.g., 5 for very satisfied
  },
  comment: {
    type: String,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Satisfaction', satisfactionSchema);