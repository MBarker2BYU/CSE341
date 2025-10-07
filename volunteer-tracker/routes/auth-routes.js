const express = require('express');
const router = express.Router();
const passport = require('passport');

// GitHub OAuth login route
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback route
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/login' }),
    (req, res) => {
        res.redirect('/api-docs');
    }
);

// Login route (for failure redirect)
router.get('/login', (req, res) => {
    res.status(401).json({ message: 'Unauthorized - Please log in via GitHub' });
});

// Logout route
router.get('/logout', (req, res, next) => {
    console.log('Logout request received:', { user: req.user ? req.user.id : 'none' });
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
                return next(err);
            }
            console.log('Session destroyed, redirecting to /auth/login');
            res.redirect(302, '/auth/login');
        });
    });
});

module.exports = router;