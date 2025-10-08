const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const router = express.Router();

// Use GITHUB_CALLBACK_URL from environment
const oauth2RedirectUrl = process.env.GITHUB_CALLBACK_URL;
if (!oauth2RedirectUrl) {
    throw new Error('GITHUB_CALLBACK_URL is not set in environment variables');
}
console.log('Using OAuth Redirect URL:', oauth2RedirectUrl); // Debug log

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