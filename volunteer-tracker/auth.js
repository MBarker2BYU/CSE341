const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const volunteerModel = require('./models/volunteer-tracking-api-model');
require('dotenv').config();

// JWT strategy options
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

// JWT strategy to verify tokens
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        // Find user by ID from JWT payload
        const user = await volunteerModel.getUserById(jwt_payload.id);
        if (user) {
            return done(null, user); // User found, attach to req.user
        }
        return done(null, false); // No user found
    } catch (error) {
        return done(error, false); // Error during verification
    }
}));

module.exports = passport;