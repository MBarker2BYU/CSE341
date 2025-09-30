const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const router = express.Router();

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Please enter JWT token in the format: Bearer <token> (e.g., Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)'
      }
    },
    security: [
      { bearerAuth: [] }
    ],
    supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
    docExpansion: 'none' // Optional: Collapse docs for clarity
  },
  customCss: '.swagger-ui .topbar { display: none; }' // Optional: Hide top bar for simplicity
}));

module.exports = router;