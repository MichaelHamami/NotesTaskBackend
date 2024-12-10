import express, { Request, Response } from 'express';
import AuthController from '../controllers/auth.controller';
import { TOKEN_NAME } from '../constants';

const authControllerInstance = new AuthController();
const router = express.Router();

const setCookieOnResponse = (res: Response, token: string) => {
  res.cookie(TOKEN_NAME, token, { httpOnly: true, secure: false });
};

router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const { username, password } = req.body;
    const token = await authControllerInstance.login(username, password);

    setCookieOnResponse(res, token);
    return res.json({ success: true, authToken: token });
  } catch (error) {
    next(error);
  }
});

router.post('/signup', async (req: Request, res: Response, next) => {
  try {
    const { username, password } = req.body;
    const token = await authControllerInstance.signup(username, password);

    setCookieOnResponse(res, token);
    return res.json({ success: true, authToken: token });
  } catch (error) {
    next(error);
  }
});

export default router;
