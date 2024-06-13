require('dotenv').config();
const mongoose = require('mongoose');

const DBCONFIG = {
    uri: process.env.DB_URI,
    options: {
        serverSelectionTimeoutMS: 30000, 
    },
};

mongoose.connect(DBCONFIG.uri, DBCONFIG.options)
    .then(() => console.log('MongoDB connection successful'))
    .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;


