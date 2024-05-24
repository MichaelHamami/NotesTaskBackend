import express, { Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import User from '../models/user.model';
import { TOKEN_NAME } from '../constants';

const authControllerInstance = new AuthController();
const router = express.Router();

router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const { fingerPrint } = req.body;
    const token = await authControllerInstance.login(fingerPrint);

    res.cookie(TOKEN_NAME, token, { httpOnly: true, secure: false });
    return res.json({ success: true, authToken: token });
  } catch (error) {
    next(error);
  }
});

router.post('/signup', async (req: Request, res: Response, next) => {
  try {
    const { fingerPrint } = req.body;
    const token = await authControllerInstance.signup(fingerPrint);

    res.cookie(TOKEN_NAME, token, { httpOnly: true, secure: false });
    return res.json({ success: true, authToken: token });
  } catch (error) {
    next(error);
  }
});

router.get('/allUsers', async (req: Request, res: Response, next) => {
  try {
    const users = await User.find().lean();

    return res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
});

export default router;
