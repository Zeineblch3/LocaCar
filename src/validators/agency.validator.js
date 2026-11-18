import { z } from 'zod';

export const agencySchema = {
  body: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    phone: z.string().min(8),
    email: z.string().email(),
  }),
  query: z.object({}),
  params: z.object({}),
};

export const agencyUpdateSchema = {
  body: agencySchema.body.partial(),
  query: z.object({}),
  params: z.object({ id: z.string().regex(/^\d+$/) }),
};