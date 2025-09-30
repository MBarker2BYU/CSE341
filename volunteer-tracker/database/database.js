const { MongoClient, ObjectId, Double } = require('mongodb');
const bcrypt = require('bcrypt');

// Number of salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;

// Function to connect to MongoDB and ping the database
exports.connectionAndPing = async function (uri, connectTimeoutMS = 30000,
  maxPoolSize = 10, serverSelectionTimeoutMS = 5000) {
  try {

    const client = await MongoClient.connect(uri, {
      connectTimeoutMS,
      maxPoolSize,
      serverSelectionTimeoutMS
    });

    await client.db().command({ ping: 1 });

    console.log('Client created and pinged successfully');

    return client;

  } catch (error) {

    console.error('Error connecting client:', error);
    throw error;

  }
}

// Function to create the database and its collections with schema validation
// Returns the database instance
// Throws an error if creation or verification fails
// Usage: const db = await createDatabase(client, 'myDatabaseName');
exports.createDatabase = async function (dbClient, dbName) {

  try {

    // Create or get the database
    const database = dbClient.db(dbName);

    // Create collections with schema validation
    await createUserCollection(database);
    await createOpportunityCollection(database);
    await createUserOpportunitiesCollection(database);
    
    // Verify the database and its collections
    if (await !exports.verifyDatabase(dbClient, dbName))
      throw new Error('Database verification failed after creation');

    // Load sample data
    await loadSampleData(database);
    console.log('Sample data loaded into the database.');

    console.log(`Database '${dbName}' created and verified successfully.`);
    return database;

  } catch (error) {

    // Log and rethrow the error
    console.error('Error creating database:', error);
    throw error;

  }

}

async function applyValidationAction(database, collectionName, action = 'error', level = 'strict') {
  try {
    await database.command({
      collMod: collectionName,
      validationAction: action,
      validationLevel: level
    });

    console.log(`Validation action set to "${action}" with "${level}" level for ${collectionName} collection.`);

  } catch (error) {

    console.error('Error applying validation action:', error);

    throw error;
  }
}

// Helper functions to create collections with schema validation
async function createUserCollection(database) {

  try {

    const collectionName = 'user';

    // Create 'user' collection with schema validation
    await database.createCollection(collectionName, {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['firstName', 'lastName', 'email', 'phoneNumber', 'accountType', 'createdAt', 'isDeleted'],
          properties: {
            firstName: { bsonType: 'string', description: 'must be a string and is required' },
            lastName: { bsonType: 'string', description: 'must be a string and is required' },
            email: { bsonType: 'string', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', description: 'must be a valid email and is required' },
            phoneNumber: { bsonType: 'string', pattern: '^\\(?[0-9]{3}\\)?[-.]?[0-9]{3}[-.]?[0-9]{4}$', description: 'must be (123)456-7890, 1234567890, 123-456-7890 or 123.456.7890' },
            accountType: { enum: ['student', 'admin', 'organizer'], description: 'must be one of student, admin, organizer' },
            password: { bsonType: 'string', description: 'must be a hashed password (bcrypt) and is required' },
            graduationYear: {
              bsonType: ['int', 'null'],
              minimum: 1900,
              maximum: 2035,
              description: 'must be an integer year, required for students'
            },
            createdAt: { bsonType: 'date', description: 'must be a date and is required' },
            isDeleted: { bsonType: 'bool', description: 'this is a soft delete' },
            deleteDate: { bsonType: ['date', 'null'], description: 'this is the soft delete date' }
          },
          additionalProperties: true
        }
      }
    });

    await applyValidationAction(database, collectionName);

    // Create unique index on email field
    await database.collection(collectionName).createIndex({ email: 1 }, { unique: true });
    console.log(`${collectionName} collection created with schema validation and unique index.`);

  } catch (error) {

    // Log and rethrow the error
    console.error(`Error creating ${collectionName} collection:`, error);
    throw error;

  }

}

async function createOpportunityCollection(database) {

  try {

    const collectionName = 'opportunity';

    // Create 'opportunity' collection with schema validation
    await database.createCollection(collectionName, {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['organizerId', 'title', 'description', 'location', 'date', 'time', 'duration', 'createdAt', 'isDeleted'],
          properties: {
            organizerId: { bsonType: 'objectId', description: 'must be an ObjectId referencing a user (organizer) and is required' },
            title: { bsonType: 'string', description: 'must be a string and is required' },
            description: { bsonType: 'string', description: 'must be a string and is required' },
            location: { bsonType: 'string', description: 'must be a string and is required' },
            date: { bsonType: 'date', description: 'must be a date and is required' },
            time: { bsonType: 'string', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$', description: 'must be a string in HH:MM format (24-hour) and is required' },
            duration: { bsonType: 'double', minimum: 0, description: 'must be a non-negative number and is required' },
            createdAt: { bsonType: 'date', description: 'must be a date and is required' },
            isDeleted: { bsonType: 'bool', description: 'this is a soft delete' },
            deleteDate: { bsonType: ['date', 'null'], description: 'this is the soft delete date' }
          },
          additionalProperties: true
        }
      }
    });

    await applyValidationAction(database, collectionName);

    // Create unique index on title and date to prevent duplicate opportunities
    await database.collection(collectionName).createIndex({ title: 1, date: 1 }, { unique: true });
    console.log(`${collectionName} collection created with schema validation and unique index.`);


  } catch (error) {

    // Log and rethrow the error
    console.error(`Error creating ${collectionName} collection:`, error);
    throw error;

  }

}

async function createUserOpportunitiesCollection(database) {

  try {

    const collectionName = 'userOpportunities';

    // Create 'userOpportunities' collection with schema validation
    await database.createCollection(collectionName, {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'opportunityId', 'createdAt', 'isDeleted'],
          properties: {
            userId: { bsonType: 'objectId', description: 'must be an ObjectId referencing a user and is required' },
            opportunityId: { bsonType: 'objectId', description: 'must be an ObjectId referencing an opportunity and is required' },
            createdAt: { bsonType: 'date', description: 'must be a date and is required' },
            isDeleted: { bsonType: 'bool', description: 'this is a soft delete' },
            deleteDate: { bsonType: ['date', 'null'], description: 'this is the soft delete date' },
            approvedBy: { bsonType: ['objectId', 'null'], description: 'must be an ObjectId referencing a user and is required' },
            approvedOn: { bsonType: ['date', 'null'], description: 'must be a date and is required' },
          },
          additionalProperties: true
        }
      }
    });

    await applyValidationAction(database, collectionName);

    // Create unique index on userId and opportunityId to prevent duplicate entries
    await database.collection(collectionName).createIndex({ userId: 1, opportunityId: 1 }, { unique: true });
    console.log(`${collectionName} collection created with schema validation and unique index.`);

  } catch (error) {

    // Log and rethrow the error
    console.error(`Error creating ${collectionName} collection:`, error);
    throw error;

  }
}


exports.verifyDatabase = async function (dbClient, dbName) {
  try {

    // Get the admin database
    const adminDb = dbClient.db().admin();
    // List all databases
    const dbList = await adminDb.listDatabases();

    const dbExists = dbList.databases.some(database => database.name === dbName);

    // If database does not exist, return false
    if (!dbExists) {
      console.log(`Database '${dbName}' does not exist.`);
      return false;
    }

    // Check for required collections
    const database = dbClient.db(dbName);
    const collections = await database.listCollections().toArray();

    // If no collections found, return false
    if (collections.length === 0) {
      console.log(`Database '${dbName}' is empty. No collections found.`);
      return false;
    }

    // Check for specific required collections
    if (!collections.find(col => col.name === 'user')) {
      console.log("Missing 'user' collection.");
      return false;
    }

    // Check for 'opportunity' collection
    if (!collections.find(col => col.name === 'opportunity')) {
      console.log("Missing 'opportunity' collection.");
      return false;
    }

    // Check for 'userOpportunities' collection
    if (!collections.find(col => col.name === 'userOpportunities')) {
      console.log("Missing 'userOpportunities' collection.");
      return false;
    }

    return true;

  } catch (error) {

    // Log and rethrow the error
    console.error('Error validating database:', error);
    throw error;
  }
}

// Load sample data into the database
async function loadSampleData(database) {

  try {
    
    // Hash sample passwords
    const password = 'Password123!'; // Strong password meeting requirements (12+ chars, uppercase, lowercase, number, special char)
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await database.collection('user').insertMany([
    {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      password: hashedPassword,
      phoneNumber: '123.456.7890',
      accountType: 'admin',
      createdAt: new Date(),
      isDeleted: false
    },
    {
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob.smith@example.com',
      password: hashedPassword,
      phoneNumber: '987.654.3210',
      accountType: 'organizer',
      createdAt: new Date(),
      isDeleted: false
    },
    {
      firstName: 'Carol',
      lastName: 'Davis',
      email: 'carol.davis@example.com',
      password: hashedPassword,
      phoneNumber: '555.555.5555',
      accountType: 'student',
      graduationYear: 2026,
      createdAt: new Date(),
      isDeleted: false
    },
    {
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@example.com',
      password: hashedPassword,
      phoneNumber: '444.444.4444',
      accountType: 'student',
      graduationYear: 2027,
      createdAt: new Date(),
      isDeleted: false
    },
    {
      firstName: 'Eve',
      lastName: 'Brown',
      email: 'eve.brown@example.com',
      password: hashedPassword,
      phoneNumber: '333.333.3333',
      accountType: 'student',
      graduationYear: 2028,
      createdAt: new Date(),
      isDeleted: false
    },
    {
      firstName: 'Frank',
      lastName: 'Green',
      email: 'frank.green@example.com',
      password: hashedPassword,
      phoneNumber: '222.222.2222',
      accountType: 'student',
      graduationYear: 2029,
      createdAt: new Date(),
      isDeleted: false
    }
  ]);

  // Find the organizer's _id
  const organizer = await database.collection('user').findOne({ accountType: 'organizer' });
  if (!organizer) {
    throw new Error('No organizer found in the user collection');
  }
  const organizerId = new ObjectId(organizer._id);

  await database.collection('opportunity').insertMany([
    {
      organizerId: organizerId,
      title: 'Community Clean-Up',
      description: 'Join us for a day of cleaning up the local park.',
      location: 'Central Park',
      date: new Date('2024-07-15'),
      time: '09:00',
      duration: new Double(4.0), // duration in hours
      createdAt: new Date(),
      isDeleted: false
    },
    {
      organizerId: organizerId,
      title: 'Food Drive',
      description: 'Help us collect and distribute food to those in need.',
      location: 'Community Center',
      date: new Date('2024-08-20'),
      time: '10:00',
      duration: new Double(3.5), // duration in hours
      createdAt: new Date(),
      isDeleted: false
    },
    {
      organizerId: organizerId,
      title: 'Tree Planting',
      description: 'Join us in planting trees to beautify the community.',
      location: 'City Park',
      date: new Date('2024-09-10'),
      time: '08:00',
      duration: new Double(5.0), // duration in hours
      createdAt: new Date(),
      isDeleted: false
    }
  ]);

  console.log('Sample data loaded into the database.');
  } catch (error) {
  
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
}