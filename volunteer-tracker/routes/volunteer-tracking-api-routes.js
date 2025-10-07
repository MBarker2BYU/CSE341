const express = require('express');
const router = express.Router();
const passport = require('passport');
const volunteerApiController = require('../controllers/volunteer-tracking-api-controller');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
};

// Define C.R.U.D. routes for volunteers (protected)
router.get('/users', isAuthenticated, volunteerApiController.getAllUsers);
router.get('/users/:id', isAuthenticated, volunteerApiController.getUserById);
router.post('/users', isAuthenticated, volunteerApiController.createUser);
router.put('/users/:id', isAuthenticated, volunteerApiController.updateUser);
router.delete('/users/:id', isAuthenticated, volunteerApiController.deleteUser);

// Define CRUD routes for opportunity management (protected)
router.get('/opportunities', isAuthenticated, volunteerApiController.getAllOpportunities);
router.get('/opportunities/:id', isAuthenticated, volunteerApiController.getOpportunityById);
router.post('/opportunities', isAuthenticated, volunteerApiController.createOpportunity);
router.put('/opportunities/:id', isAuthenticated, volunteerApiController.updateOpportunity);
router.delete('/opportunities/:id', isAuthenticated, volunteerApiController.deleteOpportunity);

// CRUD for sign up and withdraw management routes (protected)
router.get('/events/:userId/opportunities', isAuthenticated, volunteerApiController.getUserOpportunities);
router.post('/events/:userId/opportunities/:opportunityId', isAuthenticated, volunteerApiController.signUpForOpportunity);
router.put('/events/:userId/opportunities/:userOpportunityId', isAuthenticated, volunteerApiController.approveHours);
router.delete('/events/:userOpportunityId', isAuthenticated, volunteerApiController.withdrawFromOpportunity);

module.exports = router;