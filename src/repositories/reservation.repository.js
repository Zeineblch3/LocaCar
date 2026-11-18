import prisma from '../database/prisma.js';

export const ReservationRepository = {
  async create(data, tx = prisma) {
    return await tx.reservation.create({ data });
  },

  async findActiveByVehicleAndPeriod(vehicleId, startDate, endDate, tx = prisma) {
    // Vérification du chevauchement : (StartA < EndB) et (EndA > StartB)
    return await tx.reservation.findFirst({
      where: {
        vehicleId: Number(vehicleId),
        status: { in: ['PENDING', 'CONFIRMED'] },
        startDate: { lt: new Date(endDate) },
        endDate: { gt: new Date(startDate) },
      },
    });
  },

  async findById(id, tx = prisma) {
    return await tx.reservation.findUnique({
      where: { id: Number(id) },
      include: { customer: true, vehicle: true },
    });
  },

  async updateStatus(id, status, tx = prisma) {
    return await tx.reservation.update({
      where: { id: Number(id) },
      data: { status },
    });
  },

  async findAll(filter = {}) {
    return await prisma.reservation.findMany({ where: filter, include: { customer: true, vehicle: true } });
  }
};