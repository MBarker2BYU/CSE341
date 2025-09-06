const contactModel = require('../models/contacts-model');

// Get all contacts
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await contactModel.getAllContacts(req, res);

        if(!contacts) {
            return res.status(404).json({ error: 'No contacts found' });
        }

        // Set the Content-Type header to application/json
        res.setHeader('Content-Type', 'application/json');

        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get a contact by ID
exports.getContactById = async (req, res) => {
    try {
        const contact = await contactModel.getContactById(req, res);

        if(!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Set the Content-Type header to application/json
        res.setHeader('Content-Type', 'application/json');

        res.json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}