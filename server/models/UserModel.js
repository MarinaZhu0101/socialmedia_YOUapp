const crypto = require('crypto');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    user_name: { type: String, required: true },
    user_id: { type: Number, required: true, unique: true },
    user_password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

class UserModel {
    static async register(username, password) {
        const userId = UserModel.generateUniqueId();
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const newUser = new User({
            user_name: username,
            user_id: userId,
            user_password: hashedPassword,
        });

        try {
            await newUser.save();
            return userId;
        } catch (error) {
            console.error("Error in register:", error);
            throw error;
        }
    }

    static async login(username, password) {
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        try {
            const user = await User.findOne({ user_name: username, user_password: hashedPassword });
            return user;
        } catch (error) {
            console.error("Error in login:", error);
            throw error;
        }
    }

    static generateUniqueId() {
        return Math.floor(Math.random() * 900000) + 100000;
    }

    static async resetPassword(username, newPassword) {
        const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
        try {
            const user = await User.findOneAndUpdate(
                { user_name: username },
                { user_password: hashedPassword },
                { new: true }
            );
            return user;
        } catch (error) {
            console.error("Error in resetPassword:", error);
            throw error;
        }
    }
}


module.exports = UserModel;
module.exports.User = User; 
