import { ApplicationError } from '../middlewares/errorHandler';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

require('dotenv').config();
const secretKey = process.env.JWT_SECRET_KEY;

class AuthController {
  async login(username: string, password: string) {
    if (!username || !password) throw new ApplicationError(400, 'Username and Password is required');

    const user = await User.findOne({ username: username }).lean();
    if (!user) throw new ApplicationError(400, 'Username or Password is not valid');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new ApplicationError(400, 'Username or Password is not valid');

    return this.generateAuthToken(user._id.toString());
  }

  async signup(username: string, password: string) {
    if (!username || !password) throw new ApplicationError(400, 'Username and Password is required');

    const user = await User.findOne({ username: username });
    if (user) throw new ApplicationError(400, 'User is already found');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      password: hashedPassword,
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
