const mysql = require("mysql2");
const dotenv = require("dotenv").config()

const pool = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: "3306",
    password: "maskinano",
    database: "bpitdas"
})

// const pool = mysql.createConnection({
//   host: process.env.LOCAL_DB_HOST,
//   user: process.env.LOCAL_DB_USER,
//   password: process.env.LOCAL_DB_PASSWORD,
//   port: process.env.LOCAL_DB_PORT,
//   database: process.env.LOCAL_DB_NAME
// })

pool.connect((err) => {
    if (err) throw err;
    console.log("Connected!")
})

module.exports = pool;