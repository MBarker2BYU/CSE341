const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

let database = null;

exports.initdb = (callback, databaseName) => {
  if(database)
    return callback(null, database);

  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      database = client.db(databaseName);
      callback(null, database);
    })
    .catch((err) => {
      callback(err);
    });
};

exports.getdb = () => {
    if (!database) {
        throw new Error('Database not initialized');
        }

        return database;
    };

