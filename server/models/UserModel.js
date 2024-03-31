const crypto = require('crypto');
const mysql = require("mysql2");
const connection = require('./db.js');

class UserModel {
    static register(username, password, callback) {
        const userId = UserModel.generateUniqueId();
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const query = "INSERT INTO users (user_name, user_password, user_id) VALUES (?, ?, ?)";

        connection.query(query, [username, hashedPassword, userId], (error, result) => {
            callback(error, userId);
        });
    }

    static login(username, password, callback) {
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const query = "SELECT * FROM users WHERE user_name=? AND user_password=?";

        connection.query(query, [username, hashedPassword], callback);
    }

    static generateUniqueId() {
        return Math.floor(Math.random() * 900000) + 100000;
    }

    static resetPassword(username, newPassword, callback) {
        const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
        const query = "UPDATE users SET user_password = ? WHERE user_name = ?";

        connection.query(query, [hashedPassword, username], (error, result) => {
            callback(error);
        });
    }

}

module.exports = UserModel;
