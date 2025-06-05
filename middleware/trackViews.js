const PageView = require('../models/PageView');

async function trackFeedbackPageView(req, res, next) {
    try {
        await PageView.findOneAndUpdate(
            { page: 'feedback_page' },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );
        next();
    } catch (err) {
        console.error("Error tracking page view:", err);
        next(err);
    }
}

module.exports = { trackFeedbackPageView };