const express = require('express');
const app = express();
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');

const database = require('./database');
const defaultRouter = require('./routes/default-routes');
const volunteerApiRouter = require('./routes/volunteer-tracking-api-routes');
const swaggerRouter = require('./routes/swagger-routes');
const authRouter = require('./routes/auth-routes');

// Load environment variables from .env file
dotenv.config({ path: __dirname + '/.env' });

const dbName = process.env.DATABASE_NAME || 'volunteer-db';
const port = process.env.PORT || 8080;

// Debug: Log the MONGODB_URI to verify it's loaded correctly
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Middleware to parse JSON requests
app.use(express.json());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());
require('./auth'); // Load Passport GitHub strategy

// Mount routers
app.use('/', defaultRouter);
app.use('/api', volunteerApiRouter);
app.use('/', swaggerRouter);
app.use('/auth', authRouter);

// Initialize database and start server
database.initdb((err) => {
    if (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    }
    console.log('Database initialized successfully');

    const server = app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}/api-docs`);
    });

    // Graceful shutdown
    const handleShutdown = async () => {
        console.log('Received shutdown signal');
        try {
            console.log('Shutting down server...');
            console.log('Attempting to close database...');
            await database.close();
            console.log('Database closed successfully');
            console.log('Closing Express server...');
            server.close((err) => {
                if (err) {
                    console.error('Error closing Express server:', err);
                    process.exit(1);
                }
                console.log('Express server closed');
                process.exit(0);
            });
            setTimeout(() => {
                console.error('Server close timed out, forcing exit');
                process.exit(1);
            }, 5000);
        } catch (err) {
            console.error('Error during shutdown:', err);
            process.exit(1);
        }
    };

    process.on('SIGINT', () => {
        console.log('Caught SIGINT');
        handleShutdown();
    });

    process.on('SIGTERM', () => {
        console.log('Caught SIGTERM');
        handleShutdown();
    });

}, dbName);