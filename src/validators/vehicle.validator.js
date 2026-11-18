import { z } from 'zod';

export const vehicleSchema = {
  body: z.object({
    brand: z.string().min(2),
    model: z.string().min(1),
    registration: z.string().min(3),
    category: z.enum(['ECONOMY', 'COMPACT', 'SUV', 'LUXURY']),
    dailyPrice: z.number().positive(),
    year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
    agencyId: z.number().int(),
  }),
  query: z.object({
    brand: z.string().optional(),
    category: z.enum(['ECONOMY', 'COMPACT', 'SUV', 'LUXURY']).optional(),
    maxPrice: z.string().optional().transform(val => val ? Number(val) : undefined),
    page: z.string().optional().default('1').transform(val => Number(val)),
    limit: z.string().optional().default('10').transform(val => Number(val)),
  }),
  params: z.object({}),
};