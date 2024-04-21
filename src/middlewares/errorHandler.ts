import { Request, Response, NextFunction } from 'express';

class ApplicationError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApplicationError) return res.status(err.statusCode).send(err.message);
  return res.status(500).send('Internal server error');
};

export { ApplicationError, errorHandlerMiddleware };
