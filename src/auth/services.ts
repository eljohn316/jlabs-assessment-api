import * as jwt from '@node-rs/jsonwebtoken';
import { db } from '../db';
import { User } from '../../generated/prisma';
import { hashPassword } from '../common/auth';
import { ValidationException } from '../common/exceptions';

type RegisterPayload = Pick<User, 'name' | 'email' | 'password'>;

export const register = async (payload: RegisterPayload) => {
  const { name, email, password } = payload;

  const emailTaken = await getUserbyEmail(email);
  if (emailTaken) throw new ValidationException('Email already taken.');

  const image = generateDefaultImage(name);
  const hashedPassword = await hashPassword(password);

  const user = await db.user.create({
    data: {
      image,
      name,
      email,
      password: hashedPassword
    },
    omit: {
      password: true
    }
  });

  return user;
};

export const createUserToken = async (userId: number) => {
  const getUTCTimestamp = () => Math.floor(new Date().getTime() / 1000);
  const payload = {
    data: { userId },
    exp: getUTCTimestamp() + 3600,
    iat: getUTCTimestamp()
  };
  const headers = { algorithm: jwt.Algorithm.HS384 };
  return await jwt.sign(payload, process.env.SECRET_KEY as string, headers);
};

const getUserbyEmail = async (email: string) => {
  const user = await db.user.findUnique({ where: { email } });
  return user;
};

const generateDefaultImage = (name: string) => {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${name}`;
};
