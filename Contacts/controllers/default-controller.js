const database = require('../database');

// Default controller
exports.getHelloWorld = (req, res) => {
    res.send(`Hello World - Database '${database.getDatabase().databaseName}' connected and ready!`);
};