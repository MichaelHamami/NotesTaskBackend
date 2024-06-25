import express, { Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
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

export default router;
