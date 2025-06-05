// routes/admin.js
const express = require('express');
const router = express.Router();
const Satisfaction = require('../models/Satisfaction');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        const totalSubmissions = await Satisfaction.countDocuments();
        const averageSatisfaction = await Satisfaction.aggregate([
            {
                $group: {
                    _id: null,
                    avgLevel: { $avg: '$level' }
                }
            }
        ]);

        const stats = {
            total: totalSubmissions,
            average: averageSatisfaction.length > 0 ? averageSatisfaction[0].avgLevel.toFixed(2) : 'N/A'
        };

        res.render('dashboard', { 
            title: 'Admin Dashboard',
            stats: stats,
            user: req.session.user
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error fetching stats.');
    }
});

module.exports = router;