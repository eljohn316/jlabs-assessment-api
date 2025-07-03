import { Request, Response } from 'express';
import { registerSchema } from './schema';
import { ValidationException } from '../common/exceptions';
import * as authService from './services';

export const getCurrentUser = async (req: Request, res: Response) => {
  res.send('/auth/current-user handler');
};

export const login = async (req: Request, res: Response) => {
  res.send('/auth/login handler');
};

export const register = async (req: Request, res: Response) => {
  const { error, data } = registerSchema.safeParse(req.body);

  if (error) throw new ValidationException(error);

  const user = await authService.register(data);
  const token = await authService.createUserToken(user.id);

  res.status(201).json({
    user,
    token
  });
};
