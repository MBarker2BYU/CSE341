
// Import the volunteer model
const e = require('express');
const volunteerModel = require('../models/volunteer-tracking-api-model');

// Get all users
exports.getAllUsers = async (req, res) => {
    
    //#swagger.tags = ['Volunteer Tracking API']
    //#swagger.path = '/api/users'
    //#swagger.description = 'Fetch all users from the database.'

    try {

        const users = await volunteerModel.getAllUsers(req, res);

        if(!users || users.length === 0) {
            return formattedResponse(res, 404, 'No users found', []);
        }

        return formattedResponse(res, 200, 'Users fetched successfully', users);

    } catch (error) {

        console.error('Error fetching users:', error);
        return formattedErrorResponse(res, 500, 'Failed to fetch users', error);
    }

}

exports.getUserById = async (req, res) => {

    //#swagger.tags = ['Volunteer Tracking API']
    //#swagger.path = '/api/users/{id}'
    //#swagger.description = 'Fetch a user by ID from the database.'
    
    try {

        const userId = req.params.id;

        if (!userId) {
            return formattedResponse(res, 400, 'User ID is required', { message: 'Missing user ID in request parameters' });
        }

        const user = await volunteerModel.getUserById(userId);

        if (!user) {
            return formattedResponse(res, 404, 'User not found', { message: `User with ID ${userId} not found` });
        }

        return formattedResponse(res, 200, 'User fetched successfully', user);

    } catch (error) {

        console.error('Error fetching user by ID:', error);
        return formattedErrorResponse(res, 500, 'Failed to fetch user', error);

    }

}

// Validation helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validates US phone numbers in various formats
function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^\(?[0-9]{3}\)?[0-9]{3}-?[0-9]{4}$|^[0-9]{3}\.[0-9]{3}\.[0-9]{4}$/;
    return phoneRegex.test(phoneNumber);
}

// Validates account type
function isValidAccountType(accountType) {
    return ['student', 'organizer', 'admin'].includes(accountType);
}

exports.createUser = async (req, res) => {
    
    //#swagger.tags = ['Volunteer Tracking API']
    //#swagger.path = '/api/users'
    //#swagger.description = 'Create a new user in the database.'    
    
    try {

        const {firstName, lastName, email, phoneNumber, accountType} = req.body;

        if (!firstName || !lastName || !email || !phoneNumber || !accountType) {
            return formattedResponse(res, 400, 'All fields are required', { message: 'Missing required fields' });
        }
        
        if (!isValidEmail(email)) {
            return formattedResponse(res, 400, 'Invalid email format', { message: 'Email must be a valid email address' });
        }
                
        if (!isValidPhoneNumber(phoneNumber)) {
            return formattedResponse(res, 400, 'Invalid phone number format', { message: 'Phone number must be in valid E.164 format' });
        }

        if (!isValidAccountType(accountType)) {
            return formattedResponse(res, 400, 'Invalid account type', { message: 'Account type must be one of student, organizer, admin' });
        }

        const newUser = await volunteerModel.createUser(req.body);

        if (!newUser) {
            return formattedResponse(res, 500, 'Failed to create user', { message: 'User creation failed' });
        }

        return formattedResponse(res, 201, 'User created successfully', newUser);   

    } catch (error) {

        console.error('Error creating user:', JSON.stringify(error.errInfo.details, null, 2));        

        return formattedErrorResponse(res, 500, 'Failed to create user', error);

    }
};

exports.updateUser = async (req, res) => {
    
    //#swagger.tags = ['Volunteer Tracking API']
    //#swagger.path = '/api/users'
    //#swagger.description = 'Update an existing user in the database.'

    try {
        
        const userId = req.params.id;

        const {firstName, lastName, email, phoneNumber, accountType} = req.body;

        if (!firstName || !lastName || !email || !phoneNumber || !accountType) {
            return formattedResponse(res, 400, 'All fields are required', { message: 'Missing required fields' });
        }
        
        if (!isValidEmail(email)) {
            return formattedResponse(res, 400, 'Invalid email format', { message: 'Email must be a valid email address' });
        }
                
        if (!isValidPhoneNumber(phoneNumber)) {
            return formattedResponse(res, 400, 'Invalid phone number format', { message: 'Phone number must be in valid E.164 format' });
        }

        if (!isValidAccountType(accountType)) {
            return formattedResponse(res, 400, 'Invalid account type', { message: 'Account type must be one of student, organizer, admin' });
        }

        const updatedUser = await volunteerModel.updateUser(userId, req.body);

        if (!updatedUser) {
            return formattedResponse(res, 500, 'Failed to update user', { message: 'User update failed' });
        }

        return formattedResponse(res, 200, 'User updated successfully', updatedUser);

    } catch (error) {
        console.error('Error updating user:', error);
        return formattedErrorResponse(res, 500, 'Failed to update user', error);
    }
};

exports.deleteUser = async (req, res) => {

    //#swagger.tags = ['Volunteer Tracking API']    
    //#swagger.path = '/api/users/{id}'
    //#swagger.description = 'Delete a user from the database.'

    try {
        
        const userId = req.params.id;

        if (!userId) {
            return formattedResponse(res, 400, 'User ID is required', { message: 'Missing user ID in request parameters' });
        }

        const result = await volunteerModel.deleteUser(userId);

        if (!result) {
            return formattedResponse(res, 500, 'Failed to delete user', { message: 'User deletion failed' });
        }

        return formattedResponse(res, 200, 'User deleted successfully', result);

    } catch (error) {
        console.error('Error deleting user:', error);
        return formattedErrorResponse(res, 500, 'Failed to delete user', error);
    }
};


exports.getAllOpportunities = async (req, res) => {

    //#swagger.tags = ['Volunteer Tracking API']
    //#swagger.path = '/api/opportunities'
    //#swagger.description = 'Fetch all opportunities from the database.'

    try {

        const opportunities = await volunteerModel.getAllOpportunities(req, res);

        if(!opportunities || opportunities.length === 0) {
            return formattedResponse(res, 404, 'No opportunities found', []);
        }

        return formattedResponse(res, 200, 'Opportunities fetched successfully', opportunities);

    } catch (error) {

        console.error('Error fetching opportunities:', error);
        return formattedErrorResponse(res, 500, 'Failed to fetch opportunities', error);
    }

}

exports.getOpportunityById = async (req, res) => {

    //#swagger.tags = ['Volunteer Tracking API']
    //#swagger.path = '/api/opportunities/{id}'
    //#swagger.description = 'Fetch an opportunity by ID from the database.'

    try {

        const opportunityId = req.params.id;

        if (!opportunityId) {
            return formattedResponse(res, 400, 'Opportunity ID is required', { message: 'Missing opportunity ID in request parameters' });
        }

        const opportunity = await volunteerModel.getOpportunityById(opportunityId);

        if (!opportunity) {
            return formattedResponse(res, 404, 'Opportunity not found', { message: `Opportunity with ID ${opportunityId} not found` });
        }

        return formattedResponse(res, 200, 'Opportunity fetched successfully', opportunity);

    } catch (error) {

        console.error('Error fetching opportunity by ID:', error);
        return formattedErrorResponse(res, 500, 'Failed to fetch opportunity', error);

    }

}

// Validates date in YYYY-MM-DD format
function isValidDate(date) {
    return !isNaN(Date.parse(date))
}

// Validates time in HH:MM 24-hour format
function isValidTime(time) {
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(time);
}

// Validates duration as a non-negative number
function isValidDuration(duration) {
    return typeof duration === 'number' && duration >= 0;
}

exports.createOpportunity = async (req, res) => {

    //#swagger.tags = ['Volunteer Tracking API']
    //#swagger.path = '/api/opportunities'
    //#swagger.description = 'Create a new opportunity in the database.'

    try {

        const { organizerId, title, description, location, date, time, duration } = req.body;

        if (!organizerId || !title || !description || !location || !date || !time || !duration ) {
            return formattedResponse(res, 400, 'All fields are required', { message: 'Missing required fields' });
        }

        if (!isValidDate(date)) {
            return formattedResponse(res, 400, 'Invalid date format', { message: 'Date must be in YYYY-MM-DD format' });
        }

        if (!isValidTime(time)) {
            return formattedResponse(res, 400, 'Invalid time format', { message: 'Time must be in HH:MM 24-hour format' });
        }

        if (!isValidDuration(duration)) {
            return formattedResponse(res, 400, 'Invalid duration', { message: 'Duration must be a non-negative number' });
        }

        const newOpportunity = await volunteerModel.createOpportunity(req.body);

        if (!newOpportunity) {
            return formattedResponse(res, 500, 'Failed to create opportunity', { message: 'Opportunity creation failed' });
        }

        return formattedResponse(res, 201, 'Opportunity created successfully', newOpportunity);

    } catch (error) {

        console.error('Error creating user:', JSON.stringify(error.errInfo.details, null, 2));  
        return formattedErrorResponse(res, 500, 'Failed to create opportunity', error);

    }
};

exports.updateOpportunity = async (req, res) => {

    //#swagger.tags = ['Volunteer Tracking API']
    //#swagger.path = '/api/opportunities'
    //#swagger.description = 'Update an existing opportunity in the database.'

    try {

        const opportunityId = req.params.id;

        const { organizerId, title, description, location, date, time, duration } = req.body;

        if (!organizerId || !title || !description || !location || !date || !time || !duration ) {
            return formattedResponse(res, 400, 'All fields are required', { message: 'Missing required fields' });
        }

        if (!isValidDate(date)) {
            return formattedResponse(res, 400, 'Invalid date format', { message: 'Date must be in YYYY-MM-DD format' });
        }

        if (!isValidTime(time)) {
            return formattedResponse(res, 400, 'Invalid time format', { message: 'Time must be in HH:MM 24-hour format' });
        }

        if (!isValidDuration(duration)) {
            return formattedResponse(res, 400, 'Invalid duration', { message: 'Duration must be a non-negative number' });
        }

        const updatedOpportunity = await volunteerModel.updateOpportunity(opportunityId,req.body);

        if (!updatedOpportunity) {
            return formattedResponse(res, 500, 'Failed to update opportunity', { message: 'Opportunity update failed' });
        }

        return formattedResponse(res, 200, 'Opportunity updated successfully', updatedOpportunity);

    } catch (error) {

        console.error('Error updating opportunity:', error);
        return formattedErrorResponse(res, 500, 'Failed to update opportunity', error);

    }
};

exports.deleteOpportunity = async (req, res) => {

    //#swagger.tags = ['Volunteer Tracking API']
    //#swagger.path = '/api/opportunities/{id}'
    //#swagger.description = 'Delete an opportunity from the database.'

    try {

        const opportunityId = req.params.id;

        if (!opportunityId) {
            return formattedResponse(res, 400, 'Opportunity ID is required', { message: 'Missing opportunity ID in request parameters' });
        }

        const deletedOpportunity = await volunteerModel.deleteOpportunity(opportunityId);

        if (!deletedOpportunity) {
            return formattedResponse(res, 404, 'Opportunity not found', { message: `Opportunity with ID ${opportunityId} not found` });
        }

        return formattedResponse(res, 200, 'Opportunity deleted successfully', deletedOpportunity);

    } catch (error) {

        console.error('Error deleting opportunity:', error);
        return formattedErrorResponse(res, 500, 'Failed to delete opportunity', error);

    }

};

exports.getUserOpportunities = async (req, res) => {

    //#swagger.tags = ['Volunteer Tracking API']
    //#swagger.path = '/api/users/{userId}/opportunities'
    //#swagger.description = 'Fetch all opportunities for a specific user from the database.'

    try {
        const userId = req.params.userId;   

        if (!userId) {
            return formattedResponse(res, 400, 'User ID is required', { message: 'Missing user ID in request parameters' });
        }

        const opportunities = await volunteerModel.getUserOpportunities(userId);

        if(!opportunities || opportunities.length === 0) {
            return formattedResponse(res, 404, 'No opportunities found for user', []);
        }

        return formattedResponse(res, 200, 'User opportunities fetched successfully', opportunities);

    } catch (error) {

        console.error('Error fetching user opportunities:', error);
        return formattedErrorResponse(res, 500, 'Failed to fetch user opportunities', error);

    }
}

exports.signUpForOpportunity = async (req, res) => {

    //#swagger.tags = ['Volunteer Tracking API']
    //#swagger.path = '/api/users/{userId}/opportunities/{opportunityId}'
    //#swagger.description = 'Sign up a user for an opportunity.'

    try {
        const { userId, opportunityId } = req.params;
        
        if (!userId || !opportunityId) {
            return formattedResponse(res, 400, 'User ID and Opportunity ID are required', { message: 'Missing required fields' });
        }

        const signUpResult = await volunteerModel.signUpForOpportunity(userId, opportunityId);

        if (!signUpResult) {
            return formattedResponse(res, 500, 'Failed to sign up for opportunity', { message: 'Sign up failed' });
        }

        return formattedResponse(res, 200, 'Successfully signed up for opportunity', signUpResult);

    } catch (error) {
        console.error('Error signing up for opportunity:', error);
        return formattedErrorResponse(res, 500, 'Failed to sign up for opportunity', error);    
    }

};

// Soft delete user opportunity by ID
exports.withdrawFromOpportunity = async (req, res) => {

    //#swagger.tags = ['Volunteer Tracking API']
    //#swagger.path = '/api/users/{userId}/opportunities/{opportunityId}'
    //#swagger.description = 'Withdraw a user from an opportunity.'

    try {
        
        const userOpportunityId = req.params.userOpportunityId;

        if (!userOpportunityId) {
            return formattedResponse(res, 400, 'User Opportunity ID is required', { message: 'Missing required fields' });
        }

        const withdrawResult = await volunteerModel.withdrawFromOpportunity(userOpportunityId);
        if (!withdrawResult) {
            return formattedResponse(res, 500, 'Failed to withdraw from opportunity', { message: 'Withdraw failed' });
        }

        return formattedResponse(res, 200, 'Successfully withdrew from opportunity', withdrawResult);

    } catch (error) {
        console.error('Error withdrawing from opportunity:', error);
        return formattedErrorResponse(res, 500, 'Failed to withdraw from opportunity', error);
    }

};

// Approve volunteered hours for a user opportunity
exports.approveHours = async (req, res) => {

    //#swagger.tags = ['Volunteer Tracking API']
    //#swagger.path = '/api/users/{userId}/opportunities/{opportunityId}/approve'
    //#swagger.description = 'Approve volunteered hours for a user opportunity.'    

    try {
        const { userId, userOpportunityId } = req.params;
        

        if (!userId || !userOpportunityId) {
            return formattedResponse(res, 400, 'User ID and Opportunity ID are required', { message: 'Missing required fields' });
        }

        const approvalResult = await volunteerModel.approveHours(userId, userOpportunityId);

        if (!approvalResult) {
            return formattedResponse(res, 500, 'Failed to approve hours', { message: 'Approval failed' });
        }

        return formattedResponse(res, 200, 'Successfully approved hours', approvalResult);

    } catch (error) {
        console.error('Error approving hours:', error);
        return formattedErrorResponse(res, 500, 'Failed to approve hours', error);
    }

};

function formattedResponse(res, code, message, data) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(code).json({ message: message, data: data });
}

function formattedErrorResponse(res, code, message, error) {
    res.setHeader('Content-Type', 'application/json');  
    return res.status(code).json({ message: message, error: error.message });
}