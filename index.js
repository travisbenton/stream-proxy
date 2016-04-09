var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, (err, db) => {
  console.log("Connected correctly to server.");
  db.close();
});