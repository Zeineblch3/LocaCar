import prisma from '../database/prisma.js';
import { ReservationRepository } from '../repositories/reservation.repository.js';

export const ReservationService = {
  async createReservation(customerId, data) {
    const { vehicleId, startDate, endDate } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      const err = new Error('La date de fin doit être postérieure à la date de début');
      err.status = 400;
      throw err;
    }

    // Utilisation d'une transaction Prisma pour garantir l'intégrité face à la concurrence
    return await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: Number(vehicleId) } });
      if (!vehicle) {
        const err = new Error('Véhicule introuvable');
        err.status = 404;
        throw err;
      }

      const overlap = await ReservationRepository.findActiveByVehicleAndPeriod(vehicleId, start, end, tx);
      if (overlap) {
        const err = new Error('Le véhicule est déjà réservé sur cette période');
        err.status = 409; // HTTP 409 Conflict exigé[cite: 8]
        throw err;
      }

      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalPrice = diffDays * Number(vehicle.dailyPrice);

      return await ReservationRepository.create({
        customerId: Number(customerId),
        vehicleId: Number(vehicleId),
        startDate: start,
        endDate: end,
        totalPrice,
        status: 'PENDING',
      }, tx);
    });
  },

  async cancelReservation(id, userId, userRole) {
    const reservation = await ReservationRepository.findById(id);
    if (!reservation) {
      const err = new Error('Réservation introuvable');
      err.status = 404;
      throw err;
    }
    if (userRole === 'CLIENT' && reservation.customer.userId !== userId) {
      const err = new Error('Action non autorisée');
      err.status = 403;
      throw err;
    }
    return await ReservationRepository.updateStatus(id, 'CANCELLED');
  }
};