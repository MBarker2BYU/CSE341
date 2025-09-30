const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const volunteerModel = require('../models/volunteer-tracking-api-model');
const commonUtilities = require('../utilities/common');


require('dotenv').config();

// Import validation and response functions from controller
const volunteerApiController = require('../controllers/volunteer-tracking-api-controller');

// POST /auth/login - Authenticate user and issue JWT
router.post('/login', async (req, res) => {
    //#swagger.tags = ['Authentication']
    //#swagger.path = '/auth/login'
    //#swagger.description = 'Authenticate user and return JWT token.'
    /*#swagger.parameters['body'] = {
        in: 'body',
        description: 'User login credentials',
        required: true,
        schema: {
            email: 'user@example.com',
            password: 'Password123!'
        }
    }*/
    /*#swagger.responses[200] = {
        description: 'Login successful',
        schema: { message: 'Login successful', data: { token: 'jwt_token' } }
    }*/
    /*#swagger.responses[401] = {
        description: 'Invalid credentials'
    }*/
    /*#swagger.responses[422] = {
        description: 'Invalid input'
    }*/

    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return commonUtilities.formattedResponse(res, 422, 'Email and password are required', { message: 'Missing required fields' });
        }
        if (!commonUtilities.isValidEmail(email)) {
            return commonUtilities.formattedResponse(res, 422, 'Invalid email format', { message: 'Email must be a valid email address' });
        }
        if (!commonUtilities.isStrongPassword(password)) {
            return commonUtilities.formattedResponse(res, 422, 'Invalid password format', { message: 'Password must be 12+ characters with 1 uppercase, 1 lowercase, 1 number, 1 special character' });
        }

        // Find user by email
        const user = await volunteerModel.findUserByEmail(email);
        if (!user) {
            return commonUtilities.formattedResponse(res, 401, 'Invalid credentials', { message: 'Email or password is incorrect' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return commonUtilities.formattedResponse(res, 401, 'Invalid credentials', { message: 'Email or password is incorrect' });
        }

        // Generate JWT
        const payload = { id: user._id.toString(), email: user.email, accountType: user.accountType };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return commonUtilities.formattedResponse(res, 200, 'Login successful', { token });
    } catch (error) {
        console.error('Error during login:', error);
        return commonUtilities.formattedErrorResponse(res, 500, 'Failed to login', error);
    }
});

// GET /auth/logout - Instruct client to discard token
router.get('/logout', (req, res) => {
    //#swagger.tags = ['Authentication']
    //#swagger.path = '/auth/logout'
    //#swagger.description = 'Log out user by instructing client to discard JWT token.'
    /*#swagger.responses[200] = {
        description: 'Logout successful',
        schema: { message: 'Logout successful', data: {} }
    }*/

    return commonUtilities.formattedResponse(res, 200, 'Logout successful', { message: 'Please discard the JWT token on the client side' });
});

module.exports = router;