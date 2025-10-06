const express = require('express');
const router = express.Router();
const passport = require('passport');
const volunteerApiController = require('../controllers/volunteer-tracking-api-controller');

// Middleware to protect routes
const authenticate = passport.authenticate('jwt', { session: false });

// Define C.R.U.D. routes for volunteers (protected)
router.get('/users', authenticate, volunteerApiController.getAllUsers);
router.get('/users/:id', authenticate, volunteerApiController.getUserById);
router.post('/users', authenticate, volunteerApiController.createUser);
router.put('/users/:id', authenticate, volunteerApiController.updateUser);
router.delete('/users/:id', authenticate, volunteerApiController.deleteUser);

// Define CRUD routes for opportunity management (protected)
router.get('/opportunities', authenticate, volunteerApiController.getAllOpportunities);
router.get('/opportunities/:id', authenticate, volunteerApiController.getOpportunityById);
router.post('/opportunities', authenticate, volunteerApiController.createOpportunity);
router.put('/opportunities/:id', authenticate, volunteerApiController.updateOpportunity);
router.delete('/opportunities/:id', authenticate, volunteerApiController.deleteOpportunity);

// CRUD for sign up and withdraw management routes (protected)
router.get('/events/:userId/opportunities', authenticate, volunteerApiController.getUserOpportunities);
router.post('/events/:userId/opportunities/:opportunityId', authenticate, volunteerApiController.signUpForOpportunity);
router.put('/events/:userId/opportunities/:userOpportunityId', authenticate, volunteerApiController.approveHours);
router.delete('/events/:userOpportunityId', authenticate, volunteerApiController.withdrawFromOpportunity);

module.exports = router;