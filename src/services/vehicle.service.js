import { VehicleRepository } from '../repositories/vehicle.repository.js';

export const VehicleService = {
  async getVehicles(query) {
    const { page, limit, ...filters } = query;
    const skip = (page - 1) * limit;
    const { data, total } = await VehicleRepository.findFiltered(filters, skip, limit);
    return {
      data,
      pagination: {
        page,
        limit,
        totalResults: total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },
  async getVehicleById(id) {
    const vehicle = await VehicleRepository.findById(id);
    if (!vehicle) {
      const err = new Error('Véhicule introuvable');
      err.status = 404;
      throw err;
    }
    return vehicle;
  },
  async createVehicle(data) {
    return await VehicleRepository.create(data);
  },
  async updateVehicle(id, data) {
    await VehicleService.getVehicleById(id);
    return await VehicleRepository.update(id, data);
  },
  async deleteVehicle(id) {
    const vehicle = await VehicleService.getVehicleById(id);
    const hasActiveReservations = vehicle.reservations.some(r => r.status === 'PENDING' || r.status === 'CONFIRMED');
    if (hasActiveReservations) {
      const err = new Error('Impossible de supprimer un véhicule faisant l objet d une réservation active');
      err.status = 400;
      throw err;
    }
    return await VehicleRepository.delete(id);
  }
};