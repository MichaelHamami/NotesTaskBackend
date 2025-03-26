import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN_NAME, USER_TOKEN_ID } from '../constants';
import User, { UserSession, UserModel } from '../models/user.model';

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
    const userTokenId = req.headers[USER_TOKEN_ID];
    if (userTokenId) {
      const user = await User.findOne({ tokenId: userTokenId }).lean();
      if (!user) return res.status(401).send('Unauthorized');
      const userData = getUserSession(user);
      req.user = userData;
      return next();
    }

    const tokenCookie = req.cookies?.[TOKEN_NAME] || req.headers[TOKEN_NAME];
    if (!tokenCookie) return res.status(401).send('Unauthorized');
    const tokenData = jwt.verify(tokenCookie, secretKey);
    if (!tokenData) return res.status(401).send('Invalid token');

    if (typeof tokenData === 'string') return res.status(401).send('Unauthorized');
    const user = await User.findById(tokenData?.userId).lean();
    if (!user) return res.status(401).send('Unauthorized');
    const userData = getUserSession(user);
    req.user = userData;

    return next();
  } catch (error) {
    return res.status(401).send('Unauthorized');
  }
};

const getUserSession = (user: any) => {
  return {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    languageCode: user.languageCode,
  };
};
