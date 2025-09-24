const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');
const { connectionAndPing, createDatabase, verifyDatabase } = require('../database/database');

let client = null;
let database = null;

// Initialize the database connection
// Accepts a callback function and a database name
// If the database is already initialized, it returns the existing instance
// Otherwise, it connects to MongoDB and initializes the database with the provided name
exports.initdb = async (callback, databaseName, connectTimeoutMS = 30000,
    maxPoolSize = 10, serverSelectionTimeoutMS = 5000) => {

    // Validate databaseName
    if (!databaseName || typeof databaseName !== 'string' || databaseName.trim() === '') {
        return callback(new Error('A valid database name is required'));
    }

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
        // Validate MONGODB_URI
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        client = await connectionAndPing(process.env.MONGODB_URI, connectTimeoutMS,
            maxPoolSize, serverSelectionTimeoutMS);

        const dbExists = await verifyDatabase(client, databaseName);

        if (!dbExists) {

            database = await createDatabase(client, databaseName);
            console.log(`Database '${databaseName}' created successfully.`);
        }
        else {
        
            database = client.db(databaseName);
            console.log(`Database '${databaseName}' already exists.`);
        }


        callback(null, database);

    } catch (err) {

        callback(new Error(`Failed to connect to MongoDB: ${err.message}`));
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

// Close the database connection
exports.close = async () => {

    try {
            // If client exists, close the connection
            if (client) {

            // Close the MongoDB client connection
            await client.close();
            console.log('MongoDB connection closed');

            // Reset client and database to null
            database = null;
            client = null;
        }
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        throw err; // Re-throw the error for further handling if needed
    }
};

exports.checkValidator = async (database) => {
  try {

    const collection = database.collection('user'); // Target the user collection
    const options = await collection.options(); // Get collection options
    console.log("Collection: user");
    if (options.validator) {
      console.log("Validator:", JSON.stringify(options.validator, null, 2));
      console.log("Validation Action:", options.validationAction);
    } else {
      console.log("No validator set for this collection.");
    }
  } catch (error) {
    console.error("Error checking collection:", error);
  }
}

