const mysql = require("mysql2");

const pool = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: "3306",
    password: "maskinano",
    database: "bpitdas"
})

pool.connect((err) => {
    if (err) throw err;
    console.log("Connected!")
})

module.exports = pool;