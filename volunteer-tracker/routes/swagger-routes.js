const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const router = express.Router();

// Set OAuth redirect URL based on environment
const oauth2RedirectUrl = process.env.NODE_ENV === 'production'
    ? 'https://cse341-volunteer-tracker.onrender.com/auth/github/callback'
    : 'http://localhost:8080/auth/github/callback';

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
        oauth2RedirectUrl: oauth2RedirectUrl,
        oauth: {
            clientId: process.env.GITHUB_CLIENT_ID,
            appName: 'Volunteer Tracking API',
            scopes: 'user:email'
        },
        supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
        docExpansion: 'none'
    },
    customCss: '.swagger-ui .topbar { display: none; }'
}));

module.exports = router;