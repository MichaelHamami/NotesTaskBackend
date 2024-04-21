import User from '../models/user.model';
import jwt from 'jsonwebtoken';

require('dotenv').config();
const secretKey = process.env.JWT_SECRET_KEY;

class AuthController {
  async login(fingerPrint:string) {
    const user = await User.find({ fingerPrint: fingerPrint });
    console.log('user', user);
    if (user.length > 0) {
      return this.generateAuthToken(user[0]._id.toString());
    } else {
      throw new Error('User not found');
    }
  }

  async signup(fingerPrint:string) {
    const user = await User.find({ fingerPrint: fingerPrint });
    if (user.length > 0) throw new Error('User is already found');

    const newUser = new User({
      fingerPrint: fingerPrint,
    });
    const userSaved = await newUser.save();
    console.log('userSaved', userSaved);
    return this.generateAuthToken(userSaved._id.toString());
  }

  isValidAuthToken = (authToken:string) => {
    try {
      console.log('authToken', authToken, secretKey);
      const decoded = jwt.verify(authToken, secretKey);
      return !!decoded._id;
    } catch (error) {
      return false;
    }
  };

  generateAuthToken = (userId:string) => {
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
    return token;
  };
}

export default AuthController;
