import * as jwt from '@node-rs/jsonwebtoken';
import { User } from '../../generated/prisma';
import { db } from '../db';
import { hashPassword, verifyPassword } from '../common/auth';
import { UnauthorizedException, NotFoundException } from '../common/exceptions';

type LoginPayload = Pick<User, 'email' | 'password'>;
type RegisterPayload = Pick<User, 'name' | 'email' | 'password'>;

export const login = async (payload: LoginPayload) => {
  const { email, password } = payload;

  const user = await getUserbyEmail(email);
  if (!user) throw new UnauthorizedException('Invalid email or password');

  const validPassword = await verifyPassword(user.password, password);
  if (!validPassword) throw new UnauthorizedException('Invalid email or password');

  return {
    id: user.id,
    image: user.image,
    name: user.name,
    email: user.email,
    dateJoined: user.dateJoined
  };
};

export const register = async (payload: RegisterPayload) => {
  const { name, email, password } = payload;
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

export const getCurrentUser = async (userId?: number) => {
  if (!userId) throw new UnauthorizedException('Please login to get access.');

  const user = await db.user.findUnique({
    where: {
      id: userId
    },
    omit: {
      password: true
    }
  });

  if (!user) throw new NotFoundException('The user associated with this ID no longer exists');

  return user;
};

export const createUserToken = async (userId: number) => {
  // const ONE_MINUTE = 60
  // const ONE_DAY = 3600;
  const ONE_WEEK = 604800;
  const getUTCTimestamp = () => Math.floor(new Date().getTime() / 1000);
  const payload = {
    data: { userId },
    exp: getUTCTimestamp() + ONE_WEEK,
    iat: getUTCTimestamp()
  };
  const headers = { algorithm: jwt.Algorithm.HS384 };
  return await jwt.sign(payload, process.env.SECRET_KEY as string, headers);
};

export const verifyToken = async (
  token: string
): Promise<
  { valid: true; decoded: { [key: string]: any } } | { valid: false; message: string }
> => {
  try {
    const validation = { algorithms: [jwt.Algorithm.HS384] };
    const decoded = await jwt.verify(token, process.env.SECRET_KEY as string, validation);
    return { valid: true, decoded };
  } catch (error) {
    if ((error as Error).message === 'ExpiredSignature') {
      return { valid: false, message: 'Token expired. Please sign in again' };
    } else {
      return { valid: false, message: 'Invalid token. Please sign in again' };
    }
  }
};

export const getUserbyEmail = async (email: string) => {
  const user = await db.user.findUnique({ where: { email } });
  return user;
};

const generateDefaultImage = (name: string) => {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${name}`;
};
