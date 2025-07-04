import { User } from '../../generated/prisma';
import { db } from '../db';
import { createUserToken, hashPassword, verifyPassword } from '../common/auth';
import { UnauthorizedException, NotFoundException } from '../common/exceptions';

type LoginPayload = Pick<User, 'email' | 'password'>;
type RegisterPayload = Pick<User, 'name' | 'email' | 'password'>;

export const login = async (payload: LoginPayload) => {
  const { email, password } = payload;

  const user = await getUserbyEmail(email);
  if (!user) throw new UnauthorizedException('Invalid email or password');

  const validPassword = await verifyPassword(user.password, password);
  if (!validPassword) throw new UnauthorizedException('Invalid email or password');

  const token = await createUserToken(user.id);

  return {
    user: {
      id: user.id,
      image: user.image,
      name: user.name,
      email: user.email,
      dateJoined: user.dateJoined
    },
    token
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

  const token = await createUserToken(user.id);

  return { user, token };
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

export const getUserbyEmail = async (email: string) => {
  const user = await db.user.findUnique({ where: { email } });
  return user;
};

const generateDefaultImage = (name: string) => {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${name}`;
};
