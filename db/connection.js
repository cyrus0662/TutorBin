const mongoose = require("mongoose");
const config_file = require("../configs/db.json");

const mongo_todoTaskDB_conn_string = config_file.mongo_todoTaskDB_conn_string;

mongoose.connect(
  mongo_todoTaskDB_conn_string, { useNewUrlParser: true, useUnifiedTopology: true }
);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('MongoDB is connected...');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = mongoose