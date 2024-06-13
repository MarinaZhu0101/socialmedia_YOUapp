const crypto = require('crypto');
// const mysql = require("mysql2");
// const connection = require('./db.js');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    user_name: { type: String, required: true },
    user_id: { type: String, required: true },
    user_password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// class UserModel {
//     static register(username, password, callback) {
//         const userId = UserModel.generateUniqueId();
//         const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
//         const query = "INSERT INTO users (user_name, user_password, user_id) VALUES (?, ?, ?)";

//         connection.query(query, [username, hashedPassword, userId], (error, result) => {
//             callback(error, userId);
//         });
//     }

//     static login(username, password, callback) {
//         const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
//         const query = "SELECT * FROM users WHERE user_name=? AND user_password=?";

//         connection.query(query, [username, hashedPassword], callback);
//     }

//     static generateUniqueId() {
//         return Math.floor(Math.random() * 900000) + 100000;
//     }

//     static resetPassword(username, newPassword, callback) {
//         const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
//         const query = "UPDATE users SET user_password = ? WHERE user_name = ?";

//         connection.query(query, [hashedPassword, username], (error, result) => {
//             callback(error);
//         });
//     }

// }

class UserModel {
    static register(username, password, callback) {
        const userId = UserModel.generateUniqueId();
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const newUser = new User({
            user_name: username,
            user_id: userId,
            user_password: hashedPassword,
        });

        newUser.save((error) => {
            callback(error, userId);
        });
    }

    static login(username, password, callback) {
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        User.findOne({ user_name: username, user_password: hashedPassword }, callback);
    }

    static generateUniqueId() {
        return Math.floor(Math.random() * 900000) + 100000;
    }

    static resetPassword(username, newPassword, callback) {
        const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
        User.findOneAndUpdate(
            { user_name: username },
            { user_password: hashedPassword },
            { new: true },
            callback
        );
    }
}


module.exports = UserModel;
