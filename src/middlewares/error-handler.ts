import { Request, Response, NextFunction } from 'express';
import { ValidationException, UnauthorizedException } from '../common/exceptions';

const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationException) {
    res.status(err.statusCode).json({
      error: err.message,
      message:
        typeof err.errors === 'string' ? [err.errors] : err.errors.issues.map((iss) => iss.message),
      statusCode: err.statusCode
    });
    return;
  }

  if (err instanceof UnauthorizedException) {
    res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode
    });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
