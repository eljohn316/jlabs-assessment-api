import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../common/exceptions';
import { verifyToken } from '../auth/services';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedException('Please login to get access.');
  }

  const token = (authorization.split(' ') as [string, string])[1];
  const verification = await verifyToken(token);

  if (!verification.valid) throw new UnauthorizedException(verification.message);

  req.userId = (verification.decoded.data as { userId: number }).userId;

  next();
};
