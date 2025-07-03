import { Request, Response } from 'express';
import { ValidationException } from '../common/exceptions';
import { loginSchema, registerSchema } from './schema';
import * as authService from './services';

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.userId);

  res.status(200).json({
    user
  });
};

export const login = async (req: Request, res: Response) => {
  const { error, data } = loginSchema.safeParse(req.body);

  if (error) throw new ValidationException(error);

  const user = await authService.login(data);
  const token = await authService.createUserToken(user.id);

  res.status(200).json({
    user,
    token
  });
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
