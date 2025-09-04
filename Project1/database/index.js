const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let database = null;

const initdb = (callback) => {
  if(database)
    return callback(null, database);

  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      database = client.db('project1');
      callback(null, database);
    })
    .catch((err) => {
      callback(err);
    });
};

const getdb = () => {
    if (!database) {
        throw new Error('Database not initialized');
        }

        return database;
    };

module.exports = {
  initdb,
  getdb
};
