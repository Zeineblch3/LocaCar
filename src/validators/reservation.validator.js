import { z } from 'zod';

export const reservationSchema = {
  body: z.object({
    vehicleId: z.number().int().positive({ message: "L'identifiant du véhicule doit être un nombre valide" }),
    startDate: z.string().datetime({ message: "La date de début doit être au format ISO 8601 valide (ex: 2026-12-01T10:00:00.000Z)" }),
    endDate: z.string().datetime({ message: "La date de fin doit être au format ISO 8601 valide (ex: 2026-12-05T10:00:00.000Z)" }),
  }),
  query: z.object({
    customerId: z.string().optional().transform(val => val ? Number(val) : undefined),
    vehicleId: z.string().optional().transform(val => val ? Number(val) : undefined),
  }),
  params: z.object({}),
};

export const reservationIdParamSchema = {
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: "L'identifiant de la réservation doit être un nombre entier" }),
  }),
};

export const reservationRecentQuerySchema = {
  body: z.object({}),
  query: z.object({
    limit: z.string().optional().default('5').transform(val => Number(val)),
  }),
  params: z.object({}),
};