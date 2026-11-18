import { z } from 'zod';

export const registerSchema = {
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string().min(8),
    driverLicense: z.string().min(5),
  }),
  query: z.object({}),
  params: z.object({}),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  query: z.object({}),
  params: z.object({}),
};