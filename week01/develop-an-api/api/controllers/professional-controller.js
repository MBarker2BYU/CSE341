const professionalModel = require('../models/professional-model');

exports.getProfessionalProfile = async (req, res, next) => {
  try {
    const profile = await professionalModel.getProfessionalProfile();

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.json(profile);
  } catch (error) {
    if (error.message === 'Profile not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};