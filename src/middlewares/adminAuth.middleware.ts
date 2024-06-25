import { Request, Response, NextFunction } from 'express';
import { ApplicationError } from './errorHandler';

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers['mastertoken'] || req.headers['mastertoken'] !== process.env.MASTER_TOKEN) throw new ApplicationError(404, 'Not Found');

    return next();
  } catch (error) {
    return res.status(401).send('Unauthorized');
  }
};
