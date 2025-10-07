const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const router = express.Router();

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
        oauth2RedirectUrl: 'http://localhost:8080/auth/github/callback',
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