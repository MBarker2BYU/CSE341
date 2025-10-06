const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const volunteerModel = require('./models/volunteer-tracking-api-model'); // Double-check this path

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production'
    ? 'https://your-render-url.onrender.com/auth/github/callback'
    : 'http://localhost:8080/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await volunteerModel.findUserByGithubId(profile.id);
    if (!user) {
      user = await volunteerModel.createOAuthUser({
        githubId: profile.id,
        email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
        firstName: profile.displayName?.split(' ')[0] || profile.username,
        lastName: profile.displayName?.split(' ')[1] || 'GitHub',
        phoneNumber: '000-000-0000',
        accountType: 'student',
        createdAt: new Date(),
        isDeleted: false
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user._id.toString()));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await volunteerModel.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});