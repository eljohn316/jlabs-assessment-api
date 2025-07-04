import { z } from 'zod';
import { getUserbyEmail } from './services';

export const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email' })
    .refine(
      async (email) => {
        const emailTaken = await getUserbyEmail(email);
        return !emailTaken;
      },
      { message: 'Email already taken' }
    ),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be 8 or more characters long' })
});

export const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be 8 or more characters long' })
});
