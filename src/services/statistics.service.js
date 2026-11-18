import prisma from '../database/prisma.js';

export const StatisticsService = {
  async getGeneralStats() {
    // Utilisation de Promise.all pour exécuter les requêtes en parallèle[cite: 9]
    const [totalVehicles, availableVehicles, totalCustomers, totalReservations, activeReservations] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { isAvailable: true } }),
      prisma.customer.count(),
      prisma.reservation.count(),
      prisma.reservation.count({ where: { status: { in: ['PENDING', 'CONFIRMED'] } } })
    ]);

    return {
      totalVehicles,
      availableVehicles,
      totalCustomers,
      totalReservations,
      activeReservations
    };
  },

  async getReservationStats(year) {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);

    const reservations = await prisma.reservation.findMany({
      where: {
        createdAt: { gte: startDate, lt: endDate }
      },
      include: { vehicle: true }
    });

    const totalYearReservations = reservations.length;
    const completedReservations = reservations.filter(r => r.status === 'COMPLETED');
    const turnover = completedReservations.reduce((acc, r) => acc + Number(r.totalPrice), 0);

    // Calcul de la durée moyenne des locations
    let totalDays = 0;
    reservations.forEach(r => {
      const diff = Math.abs(new Date(r.endDate) - new Date(r.startDate));
      totalDays += Math.ceil(diff / (1000 * 60 * 60 * 24));
    });
    const averageDurationDays = totalYearReservations > 0 ? (totalDays / totalYearReservations).toFixed(2) : 0;

    // Véhicule le plus réservé
    const vehicleCounts = {};
    reservations.forEach(r => {
      vehicleCounts[r.vehicleId] = (vehicleCounts[r.vehicleId] || 0) + 1;
    });
    let mostReservedVehicleId = null;
    let maxCount = 0;
    for (const [vId, count] of Object.entries(vehicleCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostReservedVehicleId = Number(vId);
      }
    }

    const mostReservedVehicle = mostReservedVehicleId 
      ? await prisma.vehicle.findUnique({ where: { id: mostReservedVehicleId } }) 
      : null;

    return {
      year: Number(year),
      totalYearReservations,
      turnover,
      averageDurationDays,
      mostReservedVehicle
    };
  }
};