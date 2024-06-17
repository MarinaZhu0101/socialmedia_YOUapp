require('dotenv').config();
const mongoose = require('mongoose');

const DBCONFIG = {
    uri: process.env.DB_URI,
};

mongoose.connect(DBCONFIG.uri, DBCONFIG.options)
    .then(() => console.log('MongoDB connection successful'))
    .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;