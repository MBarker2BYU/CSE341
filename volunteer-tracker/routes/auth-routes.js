const express = require('express');
const router = express.Router();
const passport = require('passport');
const commonUtilities = require('../utilities/common');

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login/failed' }),
  (req, res) => {
    res.redirect('/auth/success');
  }
);

router.get('/login/failed', (req, res) => {
  return commonUtilities.formattedErrorResponse(res, 401, 'GitHub authentication failed', { message: 'Failed to authenticate with GitHub' });
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return commonUtilities.formattedErrorResponse(res, 500, 'Failed to logout', err);
    return commonUtilities.formattedResponse(res, 200, 'Logout successful', { message: 'Please clear session on client side' });
  });
});

router.get('/success', (req, res) => {
  if (req.isAuthenticated()) {
    return commonUtilities.formattedResponse(res, 200, 'Login successful', { user: req.user });
  }
  return commonUtilities.formattedErrorResponse(res, 401, 'Not authenticated', {});
});

module.exports = router;