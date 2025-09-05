const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professional-controller');

router.get('/', professionalController.getProfessionalProfile);

module.exports = router;