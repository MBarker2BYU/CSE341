const database = require('../database');

exports.getProfessionalProfile = async () => {
  try {
    const profile = await database.getdb().collection('profile').findOne({});
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  } catch (error) {
    console.error('Error fetching professional profile:', error);
    throw error; // Let the controller handle the error
  }
};