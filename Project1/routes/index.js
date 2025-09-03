const router = require('express').Router();

// Define a simple route
router.get('/', (req, res) => {
  res.send('Hello from the root route!');
});

module.exports = router; // Export the router