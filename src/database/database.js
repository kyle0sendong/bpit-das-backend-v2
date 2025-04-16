const mysql = require("mysql2");
const dotenv = require("dotenv").config()
const config = require("../config");
// const pool = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     port: "3306",
//     password: "maskinano",
//     database: "bpitdas"
// })

const pool = mysql.createConnection({
  host: config.LOCAL_DB_HOST,
  user: config.LOCAL_DB_USER,
  password: config.LOCAL_DB_PASSWORD,
  port: config.LOCAL_DB_PORT,
  database: config.LOCAL_DB_NAME
})

pool.connect((err) => {
    if (err) throw err;
    console.log("Connected!")
})

module.exports = pool;