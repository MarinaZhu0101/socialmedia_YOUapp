const UserModel = require('../models/UserModel');
const { sign } = require('jsonwebtoken');

class UserController {
    static registration(req, res) {
        const { username, password } = req.body;

        UserModel.register(username, password, (error, userId) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error registering user');
            }
            res.status(201).send({ message: 'User registered successfully', userId });
        });
    }

    static login(req, res) {
        const { username, password } = req.body;

        UserModel.login(username, password, (error, users) => {
            if (error || users.length === 0) {
                console.error(error);
                return res.status(400).send('Incorrect username or password');
            }

            const user = users[0];
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
        });
    }

    static resetPassword(req, res) {
        const { username, password } = req.body;
    
        UserModel.resetPassword(username, password, (error) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error resetting password');
            }
            res.status(200).send({ message: 'Password reset successfully' });
        });
    }

}

module.exports = UserController;
