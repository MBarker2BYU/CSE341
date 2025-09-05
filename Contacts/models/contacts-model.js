const database = require('../database');
const { ObjectId } = require('mongodb');    

// Get all contacts
exports.getAllContacts = async (req, res) => {
    try {

        // Fetch all contacts from the database
        const contacts = await database.getDatabase().collection('contacts').find().toArray();

        // Return the contacts
        return contacts;

    } catch (error) {
        
        console.error('Error fetching contacts:', error);
        throw error; // Let the controller handle the error
    }
}

// Get a contact by ID
exports.getContactById = async (req, res) => {
    try {
        // Fetch the contact by ID from the database
        const contact = await database.getDatabase().collection('contacts').findOne({ _id: new ObjectId(req.params.id) });

        // Return the contact
        return contact;

    } catch (error) {
        
        console.error('Error fetching contact:', error);
        throw error; // Let the controller handle the error
    }
}