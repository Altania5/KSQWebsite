const express = require('express');
const router = express.Router();
const User = require('../models/User')

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register New User' });
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('User with that username already exists.');
        }
        const user = new User({ username, password });
        await user.save();
        res.redirect('/users/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error during registration.');
    }
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Admin Login' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send('Invalid username or password.');
        }
        
        req.session.user = {
            id: user._id,
            username: user.username,
            department: user.department
        };

        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error during login.');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/');
    });
});

module.exports = router;