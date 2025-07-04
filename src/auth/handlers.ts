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

  const { user, token } = await authService.login(data);

  res.status(200).json({
    user,
    token
  });
};

export const register = async (req: Request, res: Response) => {
  const { error, data } = await registerSchema.safeParseAsync(req.body);

  if (error) throw new ValidationException(error);

  const { user, token } = await authService.register(data);

  res.status(201).json({
    user,
    token
  });
};
