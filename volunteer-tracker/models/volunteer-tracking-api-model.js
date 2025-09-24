//Import database connection
const database = require('../database');
const { ObjectId, Double } = require('mongodb');

// User related functions
exports.getAllUsers = async () => {

    try {

        const db = await database.getDatabase();

        // Execute find exclude soft deleted users using isDeleted field
        const users = await db.collection('user').find({ isDeleted: { $ne: true } }).toArray();

        return users;

    } catch (error) {

        console.error('Error fetching users:', error);
        throw error; // Let the controller handle the error
    }

}

exports.getUserById = async (userId) => {

    try {

        const db = await database.getDatabase();

        // Get user collection
        const userCollection = db.collection('user');
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

        const db = await database.getDatabase();

        const result = await db.collection('user').insertOne({
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

        // Handle MongoDB duplicate key error
        if (error.code === 11000 || (error.message && error.message.includes('duplicate key error'))) {
            
            const error = new Error(`Email '${newUser.email}' is already in use`)
            
            throw error
        }

        console.error('Error creating user:', error.errInfo.details || error.message);
        // Ensure statusCode is set
        throw Object.assign(error, { statusCode: error.statusCode || 500 });
    }
}

exports.updateUser = async (id, updatedUser) => {

    try {

        const db = await database.getDatabase();
        const userCollection = await db.collection('user');
        
        // Get the existing user
        const existingUser = await userCollection.findOne({ _id: new ObjectId(id), isDeleted: { $ne: true } });
        if (!existingUser) {
            throw new Error('User not found or already deleted');
        }

        // If email is provided and different, check for uniqueness
        if (updatedUser.email && updatedUser.email !== existingUser.email) {
            const emailInUse = await userCollection.findOne({
                email: updatedUser.email,
                _id: { $ne: new ObjectId(id) },
                isDeleted: { $ne: true }
            });
            if (emailInUse) {
                throw new Error(`Email '${updatedUser.email}' is already in use by another user`);
            }
        }

        // Set graduationYear for students
        updatedUser.graduationYear = updatedUser.accountType === "student" && updatedUser.graduationYear !== undefined ?
            (parseInt(updatedUser.graduationYear) || 2025) : null;

        // Remove email from update if unchanged to avoid index issues
        if (updatedUser.email === existingUser.email) {
            delete updatedUser.email;
        }

        const result = await userCollection.updateOne(
            { _id: new ObjectId(id), isDeleted: { $ne: true } },
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

        const db = await database.getDatabase();

        const result = await db.collection('user').updateOne(
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

        const db = await database.getDatabase();

        // Execute find exclude soft deleted opportunities using isDeleted field
        const opportunities = await db.collection('opportunity').find({ isDeleted: { $ne: true } }).toArray();

        return opportunities;

    } catch (error) {

        console.error('Error fetching opportunities:', error);
        throw error; // Let the controller handle the error
    }
}

exports.getOpportunityById = async (opportunityId) => {

    try {
        const db = await database.getDatabase();
        // Get opportunity collection
        const opportunityCollection = db.collection('opportunity');
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
        const db = await database.getDatabase();

        const result = await db.collection('opportunity').insertOne({
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

        const db = await database.getDatabase();

        const result = await db.collection('opportunity').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    organizerId: new ObjectId(updatedOpportunity.organizerId),
                    title: updatedOpportunity.title,
                    description: updatedOpportunity.description,
                    location: updatedOpportunity.location,
                    date: new Date(updatedOpportunity.date),
                    time: updatedOpportunity.time,
                    duration: new Double(updatedOpportunity.duration)
                }
            },
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

        const db = await database.getDatabase();

        const result = await db.collection('opportunity').updateOne(
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

        const db = await database.getDatabase();

        // Execute find exclude soft deleted user opportunities using isDeleted field
        const opportunities = await db.collection('userOpportunities').find({ userId: new ObjectId(userId), isDeleted: { $ne: true } }).toArray();
        return opportunities;

    } catch (error) {

        console.error('Error fetching user opportunities:', error);
        throw error; // Let the controller handle the error

    }

}

exports.signUpForOpportunity = async (userId, opportunityId) => {

    try {

        const db = await database.getDatabase();

        const result = await db.collection('userOpportunities').insertOne({
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

        const db = await database.getDatabase();

        const result = await db.collection('userOpportunities').updateOne(
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

        const db = await database.getDatabase();

        if (!approvedById || !userOpportunityId) {
            throw new Error('Missing required fields');
        }

        const result = await db.collection('userOpportunities').updateOne(
            { _id: new ObjectId(userOpportunityId) },
            {
                $set: {
                    approvedBy: new ObjectId(approvedById),
                    approvedOn: new Date()
                }
            }
        );

        return result;

    } catch (error) {

        console.error('Error approving hours:', error);
        throw error; // Let the controller handle the error

    }
}