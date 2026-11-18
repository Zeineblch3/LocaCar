import { AgencyService } from '../services/agency.service.js';

export const AgencyController = {
  async getAll(req, res, next) {
    try {
      const agencies = await AgencyService.getAllAgencies();
      res.status(200).json(agencies);
    } catch (err) { next(err); }
  },
  async getById(req, res, next) {
    try {
      const agency = await AgencyService.getAgencyById(req.params.id);
      res.status(200).json(agency);
    } catch (err) { next(err); }
  },
  async create(req, res, next) {
    try {
      const agency = await AgencyService.createAgency(req.body);
      res.status(201).json(agency);
    } catch (err) { next(err); }
  },
  async update(req, res, next) {
    try {
      const agency = await AgencyService.updateAgency(req.params.id, req.body);
      res.status(200).json(agency);
    } catch (err) { next(err); }
  },
  async remove(req, res, next) {
    try {
      await AgencyService.deleteAgency(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  }
};