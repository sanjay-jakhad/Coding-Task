const nodemailer = require('nodemailer');
const UserModel = require('../models/userModels');

class UserController {
  static async signup(req, res) {
    const { firstName, lastName, email, password } = req.body;

    try {
      const user = await UserModel.getUserByEmail(email);

      if (user) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await UserModel.createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword
      });

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getUserDetails(req, res) {
    // Extract user details from the request (assuming user data is attached to the request after authentication middleware)
    const { user } = req;

    try {
      res.json({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      });
    } catch (error) {
      console.error('Error getting user details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async resetPassword(req, res) {
    const { token, newPassword } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(token, hashedPassword);

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await UserModel.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const resetToken = Math.random().toString(36).substr(2, 10);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sanjay123@gmail.com',
          pass: '1234'
        }
      });

      const mailOptions = {
        from: 'sanjay@gmail.com',
        to: email,
        subject: 'Reset Your Password',
        text: `Click the following link to reset your password: http://localhost:3000/reset-password?token=${resetToken}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ error: 'Failed to send reset email' });
        }
        res.json({ message: 'Reset email sent successfully' });
      });
    } catch (error) {
      console.error('Error during forgot password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UserController;
