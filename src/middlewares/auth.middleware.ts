import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN_NAME } from '../constants';
import User, { UserSession } from '../models/user.model';

// Extend the Request interface with a user property
declare global {
  namespace Express {
    interface Request {
      user?: UserSession;
    }
  }
}

const secretKey = process.env.JWT_SECRET_KEY;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenCookie = req.cookies?.[TOKEN_NAME];
    if (!tokenCookie) return res.status(401).send('Unauthorized');
    const tokenData = jwt.verify(tokenCookie, secretKey);
    if (!tokenData) return res.status(401).send('Invalid token');

    if (typeof tokenData === 'string') return res.status(401).send('Unauthorized');
    const user = await User.findById(tokenData?.userId).lean();
    if (!user) return res.status(401).send('Unauthorized');

    const userData = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      languageCode: user.languageCode,
    };

    req.user = userData;

    return next();
  } catch (error) {
    return res.status(401).send('Unauthorized');
  }
};
