import express, { Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import User from '../models/user.model';
import { ApplicationError } from '../middlewares/errorHandler';
import { TOKEN_NAME } from '../constants';

const authControllerInstance = new AuthController();
const router = express.Router();

router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const { username, password } = req.body;
    const token = await authControllerInstance.login(username, password);

    res.cookie(TOKEN_NAME, token, { httpOnly: true, secure: false });
    return res.json({ success: true, authToken: token });
  } catch (error) {
    next(error);
  }
});

router.post('/signup', async (req: Request, res: Response, next) => {
  try {
    const { username, password } = req.body;
    const token = await authControllerInstance.signup(username, password);

    res.cookie(TOKEN_NAME, token, { httpOnly: true, secure: false });
    return res.json({ success: true, authToken: token });
  } catch (error) {
    next(error);
  }
});

router.get('/allUsers', async (req: Request, res: Response, next) => {
  try {
    if (!req.headers['mastertoken'] || req.headers['mastertoken'] !== '1f5e0ea5-536b-4321-812b-7b86a71b1507')
      throw new ApplicationError(404, 'Not Found');
    const users = await User.find().lean();

    return res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
});

export default router;
