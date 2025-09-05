const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let database = null;

// Initialize the database connection
// Accepts a callback function and a database name
// If the database is already initialized, it returns the existing instance
// Otherwise, it connects to MongoDB and initializes the database with the provided name
exports.initdb = async (callback, databaseName) => {

    // If database is already initialized, return it
    if (database) {

        // If a different database name is provided, return an error
        if (databaseName && database.databaseName !== databaseName) {
            return callback(new Error(`Database already initialized with a different name: ${database.databaseName}`));
        }

        // Return the existing database instance
        return callback(null, database);
    }

    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(process.env.MONGODB_URI);

        // Initialize the database with the provided name
        database = client.db(databaseName);

        // Return the database instance via callback
        callback(null, database);

    } catch (err) {

        callback(err);

    }
};

// Get the database instance
exports.getDatabase = () => {

    // If database is not initialized, throw an error
    if (!database) {
        throw new Error('Database not initialized');
    }

    // Return the database instance
    return database;
};