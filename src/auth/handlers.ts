import { Request, Response } from 'express';

export const getCurrentUser = async (req: Request, res: Response) => {
  res.send('/auth/current-user handler');
};

export const login = async (req: Request, res: Response) => {
  res.send('/auth/login handler');
};

export const register = async (req: Request, res: Response) => {
  res.send('/auth/register handler');
};
