const mysql = require("mysql2");

const DBCONFIG = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
};

const connection = mysql.createConnection(DBCONFIG);

module.exports = connection;