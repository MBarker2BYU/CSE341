const database = require('../database');
const { ObjectId } = require('mongodb');    

// Collection name
// Make sure this matches the collection name in your MongoDB
// Avoid hardcoding collection names in multiple places
const contactsCollection = 'contacts';

// Get all contacts
exports.getAllContacts = async (req, res) => {
    try {

        // Fetch all contacts from the database
        const contacts = await database.getDatabase().collection(contactsCollection).find().toArray();

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
        const contact = await database.getDatabase().collection(contactsCollection).findOne({ _id: new ObjectId(req.params.id) });

        // Return the contact
        return contact;

    } catch (error) {
        
        console.error('Error fetching contact:', error);
        throw error; // Let the controller handle the error
    }
}

// Create a new contact
exports.createContact = async (contactData) => {
    try {
        const result = await database.getDatabase().collection(contactsCollection).insertOne({
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            email: contactData.email,
            favoriteColor: contactData.favoriteColor,
            birthday: contactData.birthday
        });
        return result;
    } catch (error) {
        console.error('Error creating contact:', error);
        throw error;
    }
}

// Update a contact
exports.updateContact = async (id, contactData) => {
    try {
        const result = await database.getDatabase().collection(contactsCollection).findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    firstName: contactData.firstName,
                    lastName: contactData.lastName,
                    email: contactData.email,
                    favoriteColor: contactData.favoriteColor,
                    birthday: contactData.birthday
                }
            },
            { returnDocument: 'after' }
        );
        return result;
    } catch (error) {
        console.error('Error updating contact:', error);
        throw error;
    }
}

// Delete a contact
exports.deleteContact = async (id) => {
    try {
        const result = await database.getDatabase().collection(contactsCollection).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting contact:', error);
        throw error;
    }
}