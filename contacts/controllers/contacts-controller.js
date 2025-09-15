const contactModel = require('../models/contacts-model');

// Get all contacts
exports.getAllContacts = async (req, res) => {
    //#swagger.tags = ['Contacts']
    //#swagger.path = '/contacts'
    //#swagger.description = 'Endpoint to fetch all contacts.'
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
    //#swagger.tags = ['Contacts']
    //#swagger.path = '/contacts/{id}'
    //#swagger.description = 'Endpoint to fetch a contact by ID.'
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

// Create a new contact
exports.createContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    //#swagger.path = '/contacts'
    //#swagger.description = 'Endpoint to create a new contact.'    
    try {
        const { firstName, lastName, email, favoriteColor, birthday } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newContact = await contactModel.createContact(req.body);
        
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({ id: newContact.insertedId });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update a contact
exports.updateContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    //#swagger.path = '/contacts/{id}'
    //#swagger.description = 'Endpoint to update an existing contact.'
    try {
        const { firstName, lastName, email, favoriteColor, birthday } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const updatedContact = await contactModel.updateContact(req.params.id, req.body);

        if (!updatedContact._id) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ 
            id: updatedContact._id.toString(), 
            firstName: updatedContact.firstName, 
            lastName: updatedContact.lastName, 
            email: updatedContact.email, 
            favoriteColor: updatedContact.favoriteColor, 
            birthday: updatedContact.birthday 
        });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete a contact
exports.deleteContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    //#swagger.path = '/contacts/{id}'
    //#swagger.description = 'Endpoint to delete a contact.'
    try {
        const result = await contactModel.deleteContact(req.params.id);

        if (!result) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}