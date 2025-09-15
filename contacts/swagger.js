// this fails to create the swagger doc correctly
// because the comments in the controllers are not being
// parsed. So we need to run this file with node to generate
// the swagger-output.json file, which is then used by 
// swagger-ui-express in swagger-routes.js

const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Contacts API',
        description: 'A simple API to manage contacts'
    },
    host: 'localhost:8080',
    schemes: ['http', 'https'],
};  

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/default-routes.js', './routes/contacts-routes.js', './controllers/default-controller.js', './controllers/contacts-controller.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);