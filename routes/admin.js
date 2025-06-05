// routes/admin.js
const express = require('express');
const router = express.Router();
const Satisfaction = require('../models/Satisfaction');
const { ensureAuthenticated } = require('../middleware/auth');

function formatSecondsToTime(avgSeconds) {
    if (isNaN(avgSeconds)) {
        return 'N/A';
    }
    const totalSeconds = Math.floor(avgSeconds) % 86400;

    let hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${paddedMinutes} ${ampm}`;
}

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        const totalSubmissions = await Satisfaction.countDocuments();
        const averageSatisfaction = await Satisfaction.aggregate([
            { $group: { _id: null, avgLevel: { $avg: '$level' } } }
        ]);

        const averageTimeOfDay = await Satisfaction.aggregate([
    {
        $project: {
            secondsFromMidnight: {
                $add: [
                    { $multiply: [{ $hour: { date: "$submittedAt", timezone: "America/New_York" } }, 3600] },
                    { $multiply: [{ $minute: { date: "$submittedAt", timezone: "America/New_York" } }, 60] },
                    { $second: { date: "$submittedAt", timezone: "America/New_York" } }
                ]
            }
        }
    },
    {
        $group: {
            _id: null,
            avgSeconds: { $avg: "$secondsFromMidnight" }
        }
    }
]);
        
        const avgSeconds = averageTimeOfDay.length > 0 ? averageTimeOfDay[0].avgSeconds : NaN;
        
        const stats = {
            total: totalSubmissions,
            average: averageSatisfaction.length > 0 ? averageSatisfaction[0].avgLevel.toFixed(2) : 'N/A',
            averageTime: formatSecondsToTime(avgSeconds)
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