import { ApplicationError } from '../middlewares/errorHandler';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

require('dotenv').config();
const secretKey = process.env.JWT_SECRET_KEY;

class AuthController {
  async login(fingerPrint: string) {
    if (!fingerPrint) throw new ApplicationError(400, 'FingerPrint is required');

    const user = await User.findOne({ fingerPrint: fingerPrint }).lean();
    if (!user) throw new ApplicationError(400, 'FingerPrint is not valid');

    return this.generateAuthToken(user._id.toString());
  }

  async signup(fingerPrint: string) {
    if (!fingerPrint) throw new ApplicationError(400, 'FingerPrint is required');

    const user = await User.findOne({ fingerPrint: fingerPrint });
    if (user) throw new ApplicationError(400, 'User is already found');

    const newUser = new User({
      fingerPrint: fingerPrint,
    });

    const userSaved = await newUser.save();
    return this.generateAuthToken(userSaved._id.toString());
  }

  isValidAuthToken = (authToken: string) => {
    try {
      console.log('authToken', authToken, secretKey);
      const decoded = jwt.verify(authToken, secretKey);
      if (typeof decoded === 'string') return !!decoded;
      return !!decoded._id;
    } catch (error) {
      return false;
    }
  };

  generateAuthToken = (userId: string) => {
    return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
  };
}

export default AuthController;
