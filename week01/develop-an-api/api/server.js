const express = require('express');
const app = express();
const dotenv = require('dotenv');

const professionalRoutes = require('./routes/professional-routes');
const database = require('./database');

const port = process.env.PORT || 8080;

dotenv.config({ path: __dirname + '/.env' });

console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debug

// Serve static files from the frontend directory
app.use(express.static('frontend'));

// Parse JSON bodies
app.use(express.json());

//Routes
app.use('/professional', professionalRoutes);

// Initialize database and sample data
database.initdb((err) => {
  if (err) {
    console.error('Failed to initialize database:', err);
    return
  }

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}, 'professional-db');