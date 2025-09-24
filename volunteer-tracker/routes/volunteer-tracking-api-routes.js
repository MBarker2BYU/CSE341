const express = require('express');
const router = express.Router();

const volunteerApiController = require('../controllers/volunteer-tracking-api-controller');

// Define C.R.U.D. routes for volunteers
router.get('/users', volunteerApiController.getAllUsers);
router.get('/users/:id', volunteerApiController.getUserById);
router.post('/users', volunteerApiController.createUser);
router.put('/users/:id', volunteerApiController.updateUser);
router.delete('/users/:id', volunteerApiController.deleteUser);

// Define CRUD routes for opportunity management
router.get('/opportunities', volunteerApiController.getAllOpportunities);
router.get('/opportunities/:id', volunteerApiController.getOpportunityById);
router.post('/opportunities', volunteerApiController.createOpportunity);
router.put('/opportunities/:id', volunteerApiController.updateOpportunity);
router.delete('/opportunities/:id', volunteerApiController.deleteOpportunity);

// Sign up and withdraw management Routes
router.get('/events/:userId/opportunities', volunteerApiController.getUserOpportunities);
router.post('/events/:userId/opportunities/:opportunityId', volunteerApiController.signUpForOpportunity);
router.put('/events/:userId/opportunities/:userOpportunityId', volunteerApiController.approveHours);
router.delete('/events/:userOpportunityId', volunteerApiController.withdrawFromOpportunity);


module.exports = router;