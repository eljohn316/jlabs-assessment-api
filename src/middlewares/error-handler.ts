import { Request, Response, NextFunction } from 'express';
import {
  ValidationException,
  UnauthorizedException,
  NotFoundException
} from '../common/exceptions';

const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationException) {
    res.status(err.statusCode).json({
      message: err.message,
      data: err.errors.flatten().fieldErrors,
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

  if (err instanceof NotFoundException) {
    res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode
    });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
