const database = require('../database');
const { ObjectId } = require('mongodb'); // Ensure correct import

const getAllUsers = async (req, res) => {
  try {
    const db = database.getdb();
    console.log('Current database:', db.databaseName); // Debug log
    const users = await db.collection('users').find().toArray();
    console.log('Fetched users:', users); // Debug log
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  
  try {
    const db = database.getdb();
    // Debug the ObjectId constructor
    console.log('ObjectId constructor:', ObjectId);
    // Validate and use new ObjectId for compatibility
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) }); // Use 'new' to avoid error

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById
};