const UserModel = require('../models/UserModel');
const { sign } = require('jsonwebtoken');

class UserController {
    static async registration(req, res) {
        const { username, password } = req.body;

        try {
            const userId = await UserModel.register(username, password);
            res.status(201).send({ message: 'User registered successfully', userId });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).send('Error registering user');
        }
    }

    static async login(req, res) {
        const { username, password } = req.body;

        try {
            const user = await UserModel.login(username, password);
            if (!user) {
                return res.status(400).send('Incorrect username or password');
            }

            const accessToken = sign(
                { username: user.user_name, userId: user.user_id },
                process.env.JWT_SECRET
            );

            res.status(200).send({
                message: 'Login successful',
                username: user.user_name,
                userId: user.user_id,
                token: accessToken,
            });
        } catch (error) {
            console.error("Error logging in:", error);
            res.status(500).send('Error logging in');
        }
    }

    static async resetPassword(req, res) {
        const { username, password } = req.body;
    
        try {
            await UserModel.resetPassword(username, password);
            res.status(200).send({ message: 'Password reset successfully' });
        } catch (error) {
            console.error("Error resetting password:", error);
            res.status(500).send('Error resetting password');
        }
    }

}

module.exports = UserController;
