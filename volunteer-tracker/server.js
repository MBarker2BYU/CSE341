const express = require('express');
const app = express();
const dotenv = require('dotenv');

const passport = require('passport');

const database = require('./database');

const defaultRouter = require('./routes/default-routes');
const volunteerApiRouter = require('./routes/volunteer-tracking-api-routes');
const swaggerRouter = require('./routes/swagger-routes');
const authRouter = require('./routes/auth-routes');

// Load environment variables from .env file
// Ensure the path is correct if .env is not in the root directory
dotenv.config({ path: __dirname + '/.env' });

const dbName = process.env.DATABASE_NAME || 'volunteer-db';
const port = process.env.PORT || 8080;

// Debug: Log the MONGODB_URI to verify it's loaded correctly
console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debug
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Parse JSON bodies
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());
require('./auth'); // Load Passport JWT strategy

// Mount the default router
app.use('/', defaultRouter);
app.use('/api', volunteerApiRouter);
app.use('/', swaggerRouter);
app.use('/auth', authRouter);

// Initialize database and start server
// Ensure the database is initialized before starting the server
database.initdb((err) => {
    if (err) {
        // If there's an error during initialization, log it and exit
        console.error('Failed to initialize database:', err);
        // End the process with a failure code
        process.exit(1);
    }
    // Debug: Log successful database initialization
    console.log('Database initialized successfully');

    // Start the server only after the database is initialized
    const server = app.listen(port, () => {
        // Log a message indicating the server is running
        console.log(`Server is running on port http://localhost:${port}`);
    });

    // database.checkValidator(database);

    // Graceful shutdown
    const handleShutdown = async () => {
        // Log the shutdown signal
        console.log('Received shutdown signal');

        try {
            // Log the shutdown process
            console.log('Shutting down server...');
            console.log('Attempting to close database...'); // Debug log
            
            // Close the database connection
            await database.close();

            // Log successful database closure
            console.log('Database closed successfully');

            // Log the server closure process
            console.log('Closing Express server...');

            // Close the Express server
            server.close((err) => {
                if (err) {
                    console.error('Error closing Express server:', err);
                    process.exit(1);
                }
                console.log('Express server closed');
                process.exit(0);
            });

            // Force exit after 5 seconds if server.close() hangs
            setTimeout(() => {
                console.error('Server close timed out, forcing exit');
                process.exit(1);
            }, 5000);

        } catch (err) {
            console.error('Error during shutdown:', err);
            process.exit(1);
        }
    };

    // Handle termination signals
    process.on('SIGINT', () => {
        console.log('Caught SIGINT');
        handleShutdown();
    });

    // Handle termination signals
    process.on('SIGTERM', () => {
        console.log('Caught SIGTERM');
        handleShutdown();
    });

}, dbName);