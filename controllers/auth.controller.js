const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET_KEY;

class AuthController {
  async login(fingerPrint) {
    const user = await User.find({ fingerPrint: fingerPrint });
    console.log('user', user);
    if (user.length > 0) {
      return this.generateAuthToken(user[0]._id);
    } else {
      throw new Error('User not found');
    }
  }

  async signup(fingerPrint) {
    const user = await User.find({ fingerPrint: fingerPrint });
    if (user.length > 0) throw new Error('User is already found');

    const newUser = new User({
      fingerPrint: fingerPrint,
    });
    const userSaved = await newUser.save();
    console.log('userSaved', userSaved);
    return this.generateAuthToken(userSaved._id);
  }

  isValidAuthToken = (authToken) => {
    try {
      console.log('authToken', authToken, secretKey);
      const decoded = jwt.verify(authToken, secretKey);
      return !!decoded._id;
    } catch (error) {
      return false;
    }
  };

  generateAuthToken = (userId) => {
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
    return token;
  };
}

module.exports = AuthController;
