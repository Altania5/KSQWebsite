const mongoose = require('mongoose');

const pageViewSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        unique: true
    },
    count: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('PageView', pageViewSchema);