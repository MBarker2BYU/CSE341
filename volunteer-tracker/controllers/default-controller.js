const database = require('../database');

// Default controller
exports.welcome = (req, res) => {
    //#swagger.tags = ['Default']
    //#swagger.path = '/'
    //#swagger.description = 'Welcome endpoint to verify the API is running and connected to the database.'    
    try {
        res.send({message: `Volunteer Tracker API is running! - Database '${database.getDatabase().databaseName}' connected and ready!`});
    } catch (error) {
        return res.status(500).send({message: 'Database connection error', error: error.message});
    }
    
};

