const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const config = require("../config");

// const pool = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     port: "3306",
//     password: "maskinano",
//     database: "bpitdas"
// })

// Create connection pool
const pool = mysql.createPool({
    host: config.LOCAL_DB_HOST,
    user: config.LOCAL_DB_USER,
    password: config.LOCAL_DB_PASSWORD,
    port: config.LOCAL_DB_PORT,
    database: config.LOCAL_DB_NAME,

    connectionLimit: 10,
    acquireTimeout: 60000,
    
    reconnect: true,
  
    keepAliveInitialDelay: 0,
    enableKeepAlive: true
});

pool.on('connection', function (connection) {
    console.log('Connected to database as id ' + connection.threadId);
});

pool.on('error', function(err) {
  console.error('Database error:', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Attempting to reconnect...');
  } else {
      throw err;
  }
});

// Test the pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Database pool connected successfully!');
  connection.release();
});

module.exports = pool;