import { hash, verify } from '@node-rs/argon2';
import * as jwt from '@node-rs/jsonwebtoken';

export const hashPassword = async (password: string) => {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });
};

export const verifyPassword = async (hashed: string, password: string) => {
  return await verify(hashed, password);
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
