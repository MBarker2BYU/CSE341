const database = require('../database');

// Default controller
exports.getHelloWorld = (req, res) => {
    //#swagger.tags = ['Default']
    //#swagger.path = '/'
    //#swagger.description = 'Endpoint to return a Hello World message.'
    res.send(`Hello World - Database '${database.getDatabase().databaseName}' connected and ready!`);
};