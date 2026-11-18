import { AgencyRepository } from '../repositories/agency.repository.js';

export const AgencyService = {
  async getAllAgencies() {
    return await AgencyRepository.findAll();
  },
  async getAgencyById(id) {
    const agency = await AgencyRepository.findById(id);
    if (!agency) {
      const err = new Error('Agence introuvable');
      err.status = 404;
      throw err;
    }
    return agency;
  },
  async createAgency(data) {
    return await AgencyRepository.create(data);
  },
  async updateAgency(id, data) {
    await AgencyService.getAgencyById(id);
    return await AgencyRepository.update(id, data);
  },
  async deleteAgency(id) {
    const agency = await AgencyService.getAgencyById(id);
    if (agency.vehicles && agency.vehicles.length > 0) {
      const err = new Error('Impossible de supprimer une agence qui possède des véhicules associés');
      err.status = 400;
      throw err;
    }
    return await AgencyRepository.delete(id);
  }
};