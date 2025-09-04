const router = require('express').Router();

// Define a simple route
router.get('/', (req, res) => {
  res.send('Hello from the root route!');
});

router.use('/users', require('./users'));

module.exports = router; // Export the router