const express = require('express');
const app = express();

const mongodb = require('./database');

const port = process.env.PORT || 3000;

app.use('/', require('./routes'));

mongodb.initdb((err) => {
  if (err) {
    console.error(`Failed to connect to the database. ${err}`);
  }
  else
  {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port} and ready to accept connections.`);
    });
  }
})


