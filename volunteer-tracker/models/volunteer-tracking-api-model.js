//Import database connection
const database = require('../database');
const { ObjectId, Double } = require('mongodb');

// User related functions
exports.getAllUsers = async () => {

    try {

    // Execute find exclude soft deleted users using isDeleted field
    const users = await database.getDatabase().collection('user').find({ isDeleted: { $ne: true } }).toArray();

    return users;

    } catch (error) {

        console.error('Error fetching users:', error);
        throw error; // Let the controller handle the error
    }

}

exports.getUserById = async (userId) => {

    try {
        
        // Get user collection
        const userCollection = database.getDatabase().collection('user');
        // Find user by ID exclude soft deleted users using isDeleted field
        const user = await userCollection.findOne({ _id: new ObjectId(userId), isDeleted: { $ne: true } });
        // If no user found, return null
        return user;

    } catch (error) {

        console.error('Error fetching user by ID:', error);
        throw error; // Let the controller handle the error

    }

}

exports.createUser = async (newUser) => {

    try {

        const result = await database.getDatabase().collection('user').insertOne({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,            
            accountType: newUser.accountType,
            createdAt: new Date(),
            isDeleted: false,
            graduationYear: newUser.accountType === "student" ? (parseInt(newUser.graduationYear) || 2025) : null
        });

        return result;

    } catch (error) {

        console.error('Error creating user:', error.errInfo.details || error.message);

        throw error; // Let the controller handle the error

    }
}

exports.updateUser = async (id, updatedUser) => {
    
    try {
        
        updatedUser.graduationYear = updatedUser.accountType === "student" && updatedUser.graduationYear !== undefined ? 
            (parseInt(updatedUser.graduationYear) || 2025) : null;

        const result = await database.getDatabase().collection('user').updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedUser },
            { returnDocument: 'after' }
        );

        return result;

    } catch (error) {
        
        console.error('Error updating user:', error);
        throw error; // Let the controller handle the error

    }

}

// Soft delete user by ID
exports.deleteUser = async (id) => {
    
    try {

        const result = await database.getDatabase().collection('user').updateOne(
            { _id: new ObjectId(id) },
            { $set: { deletedAt: new Date(), isDeleted: true } }
        );

        return result;

    } catch (error) {

        console.error('Error deleting user:', error);
        throw error; // Let the controller handle the error

    }

}

// Opportunity related functions (placeholders for now)
exports.getAllOpportunities = async () => {
        try {

    // Execute find exclude soft deleted opportunities using isDeleted field
    const opportunities = await database.getDatabase().collection('opportunity').find({ isDeleted: { $ne: true } }).toArray();

    return opportunities;

    } catch (error) {

        console.error('Error fetching opportunities:', error);
        throw error; // Let the controller handle the error
    }
}

exports.getOpportunityById = async (opportunityId) => {
        
        try {
        
        // Get opportunity collection
        const opportunityCollection = database.getDatabase().collection('opportunity');
        // Find opportunity by ID exclude soft deleted opportunities using isDeleted field
        const opportunity = await opportunityCollection.findOne({ _id: new ObjectId(opportunityId), isDeleted: { $ne: true } });
        // If no opportunity found, return null
        return opportunity;

    } catch (error) {

        console.error('Error fetching opportunity by ID:', error);
        throw error; // Let the controller handle the error

    }
}

exports.createOpportunity = async (newOpportunity) => {
        
    try {
                
        const result = await database.getDatabase().collection('opportunity').insertOne({
            organizerId: new ObjectId(newOpportunity.organizerId),
            title: newOpportunity.title,
            description: newOpportunity.description,
            location: newOpportunity.location,
            date: new Date(newOpportunity.date), // Convert string to Date
            time: newOpportunity.time,
            duration: new Double(newOpportunity.duration), // Ensure double type
            createdAt: new Date(), // Set current timestamp
            isDeleted: false // Add required isDeleted field
        });

        return result;

    } catch (error) {

        console.error('Error creating opportunity:', error);
        throw error; // Let the controller handle the error

    }
};

exports.updateOpportunity = async (id, updatedOpportunity) => {
    try {

        const result = await database.getDatabase().collection('opportunity').updateOne(
            { _id: new ObjectId(id) },
            { $set: {
                organizerId: new ObjectId(updatedOpportunity.organizerId),
                title: updatedOpportunity.title,
                description: updatedOpportunity.description,
                location: updatedOpportunity.location,
                date: new Date(updatedOpportunity.date),
                time: updatedOpportunity.time,
                duration: new Double(updatedOpportunity.duration)
            } },
            { returnDocument: 'after' }
        );

        return result;

    } catch (error) {

        console.error('Error updating opportunity:', error);
        throw error; // Let the controller handle the error

    }
};

// Soft delete opportunity by ID
exports.deleteOpportunity = async (id) => {

    try {

        const result = await database.getDatabase().collection('opportunity').updateOne(
            { _id: new ObjectId(id) },
            { $set: { deletedAt: new Date(), isDeleted: true } }
        );

        return result;

    } catch (error) {

        console.error('Error deleting opportunity:', error);
        throw error; // Let the controller handle the error

    }
}        


exports.getUserOpportunities = async (userId) => {

    try {

        // Execute find exclude soft deleted user opportunities using isDeleted field
        const opportunities = await database.getDatabase().collection('userOpportunities').find({ userId: new ObjectId(userId), isDeleted: { $ne: true } }).toArray();
        return opportunities;

    } catch (error) {

        console.error('Error fetching user opportunities:', error);
        throw error; // Let the controller handle the error

    }

}

exports.signUpForOpportunity = async (userId, opportunityId) => {
        
    try {

        const result = await database.getDatabase().collection('userOpportunities').insertOne({
            userId: new ObjectId(userId),
            opportunityId: new ObjectId(opportunityId),
            createdAt: new Date(),
            isDeleted: false
        });

        if (!result.acknowledged) {
            throw new Error('Failed to sign up for opportunity');
        }

        return result;

    } catch (error) {

        console.error('Error signing up for opportunity:', error);
        throw error; // Let the controller handle the error

    }
}

// soft delete user opportunity by ID
exports.withdrawFromOpportunity = async (userOpportunityId) => {

    try {

        const result = await database.getDatabase().collection('userOpportunities').updateOne(
            { _id: new ObjectId(userOpportunityId) },
            { $set: { deletedAt: new Date(), isDeleted: true } }
        );

        return result;

    } catch (error) {

        console.error('Error withdrawing from opportunity:', error);
        throw error; // Let the controller handle the error

    }       

}
       

exports.approveHours = async (approvedById, userOpportunityId) => {
``
    try {
        
        if (!approvedById || !userOpportunityId ) {
            throw new Error('Missing required fields');
        }   

        const result = await database.getDatabase().collection('userOpportunities').updateOne(
            { _id: new ObjectId(userOpportunityId) },
            { $set: {
                approvedBy: new ObjectId(approvedById),
                approvedOn: new Date()
            } }
        );

        return result;

    } catch (error) {

        console.error('Error approving hours:', error);
        throw error; // Let the controller handle the error

    }
}