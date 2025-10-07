const database = require('../database');
const bcrypt = require('bcrypt');
const { ObjectId, Double } = require('mongodb');

// Number of salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;

// User related functions
exports.getAllUsers = async () => {
    try {
        const db = await database.getDatabase();
        const users = await db.collection('user').find(
            { isDeleted: { $ne: true } },
            { projection: { password: 0 } }
        ).toArray();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

exports.getUserById = async (userId) => {
    try {
        const db = await database.getDatabase();
        const userCollection = db.collection('user');
        const user = await userCollection.findOne(
            { _id: new ObjectId(userId), isDeleted: { $ne: true } },
            { projection: { password: 0 } }
        );
        return user;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};

// exports.findUserByEmail = async (email) => {
//     try {
//         const db = await database.getDatabase();
//         const user = await db.collection('user').findOne(
//             { email, isDeleted: { $ne: true } }
//         );
//         return user;
//     } catch (error) {
//         console.error('Error fetching user by email:', error);
//         throw error;
//     }
// };

exports.createUser = async (newUser) => {
    try {
        const db = await database.getDatabase();

        if (!newUser.password) {
            throw new Error('Password is required');
        }
        const hashedPassword = await bcrypt.hash(newUser.password, SALT_ROUNDS);

        const result = await db.collection('user').insertOne({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            password: hashedPassword,
            phoneNumber: newUser.phoneNumber,
            accountType: newUser.accountType,
            createdAt: new Date(),
            isDeleted: false,
            graduationYear: newUser.accountType === "student" ? (parseInt(newUser.graduationYear) || 2025) : null
        });

        const insertedUser = await db.collection('user').findOne(
            { _id: result.insertedId },
            { projection: { password: 0 } }
        );

        return insertedUser;
    } catch (error) {
        if (error.code === 11000 || (error.message && error.message.includes('duplicate key error'))) {
            throw new Error(`Email '${newUser.email}' is already in use`);
        }
        console.error('Error creating user:', error.errInfo?.details || error.message);
        throw Object.assign(error, { statusCode: error.statusCode || 500 });
    }
};

exports.updateUser = async (id, updatedUser) => {
    try {
        const db = await database.getDatabase();
        const userCollection = await db.collection('user');

        const existingUser = await userCollection.findOne(
            { _id: new ObjectId(id), isDeleted: { $ne: true } }
        );
        if (!existingUser) {
            throw new Error('User not found or already deleted');
        }

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

        const updateData = { ...updatedUser };
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
        }

        updateData.graduationYear = updateData.accountType === "student" && updateData.graduationYear !== undefined ?
            parseInt(updateData.graduationYear) || 2025 : null;

        if (updateData.email === existingUser.email) {
            delete updateData.email;
        }

        const result = await userCollection.findOneAndUpdate(
            { _id: new ObjectId(id), isDeleted: { $ne: true } },
            { $set: updateData },
            { returnDocument: 'after', projection: { password: 0 } }
        );

        return result;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

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
        throw error;
    }
};

// Opportunity related functions
exports.getAllOpportunities = async () => {
    try {
        const db = await database.getDatabase();
        const opportunities = await db.collection('opportunity').find({ isDeleted: { $ne: true } }).toArray();
        return opportunities;
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        throw error;
    }
};

exports.getOpportunityById = async (opportunityId) => {
    try {
        const db = await database.getDatabase();
        const opportunityCollection = db.collection('opportunity');
        const opportunity = await opportunityCollection.findOne(
            { _id: new ObjectId(opportunityId), isDeleted: { $ne: true } }
        );
        return opportunity;
    } catch (error) {
        console.error('Error fetching opportunity by ID:', error);
        throw error;
    }
};

exports.createOpportunity = async (newOpportunity) => {
    try {
        const db = await database.getDatabase();
        const result = await db.collection('opportunity').insertOne({
            organizerId: new ObjectId(newOpportunity.organizerId),
            title: newOpportunity.title,
            description: newOpportunity.description,
            location: newOpportunity.location,
            date: new Date(newOpportunity.date),
            time: newOpportunity.time,
            duration: new Double(newOpportunity.duration),
            createdAt: new Date(),
            isDeleted: false
        });
        return result;
    } catch (error) {
        console.error('Error creating opportunity:', error);
        throw error;
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
        throw error;
    }
};

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
        throw error;
    }
};

exports.getUserOpportunities = async (userId) => {
    try {
        const db = await database.getDatabase();
        const opportunities = await db.collection('userOpportunities').find(
            { userId: new ObjectId(userId), isDeleted: { $ne: true } }
        ).toArray();
        return opportunities;
    } catch (error) {
        console.error('Error fetching user opportunities:', error);
        throw error;
    }
};

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
        throw error;
    }
};

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
        throw error;
    }
};

exports.approveHours = async (approvedById, userOpportunityId) => {
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
        throw error;
    }
};

// Explicit exports for all functions
module.exports = {
    getAllUsers: exports.getAllUsers,
    getUserById: exports.getUserById,
    findUserByEmail: exports.findUserByEmail,
    createUser: exports.createUser,
    updateUser: exports.updateUser,
    deleteUser: exports.deleteUser,
    getAllOpportunities: exports.getAllOpportunities,
    getOpportunityById: exports.getOpportunityById,
    createOpportunity: exports.createOpportunity,
    updateOpportunity: exports.updateOpportunity,
    deleteOpportunity: exports.deleteOpportunity,
    getUserOpportunities: exports.getUserOpportunities,
    signUpForOpportunity: exports.signUpForOpportunity,
    withdrawFromOpportunity: exports.withdrawFromOpportunity,
    approveHours: exports.approveHours
};