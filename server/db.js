// const mysql = require("mysql2");

// const DBCONFIG = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: process.env.DB_PORT,
// };

// const connection = mysql.createConnection(DBCONFIG);

// module.exports = connection;

require('dotenv').config();
const mongoose = require('mongoose');

const DBCONFIG = {
    uri: process.env.DB_URI,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};

mongoose.connect(DBCONFIG.uri, DBCONFIG.options)
    .then(() => console.log('MongoDB connection successful'))
    .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;


