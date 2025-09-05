const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/default-controller');

// Define route for the default controller
router.get('/', defaultController.getHelloWorld);

module.exports = router;