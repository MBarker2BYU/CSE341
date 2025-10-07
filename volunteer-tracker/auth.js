const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();

// Set callback URL based on environment
const callbackURL = process.env.NODE_ENV === 'production'
    ? 'https://cse341-volunteer-tracker.onrender.com/auth/github/callback'
    : 'http://localhost:8080/auth/github/callback';

// Configure GitHub OAuth strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: callbackURL
}, (accessToken, refreshToken, profile, done) => {
    console.log('GitHub callback:', { accessToken: accessToken ? 'present' : 'missing', profile });
    return done(null, profile); // Pass profile directly, no database lookup
}));

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id); // Use GitHub profile.id
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
    done(null, { id }); // No database lookup
});

module.exports = passport;