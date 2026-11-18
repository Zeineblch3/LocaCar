import { VehicleService } from '../services/vehicle.service.js';

export const VehicleController = {
  async getAll(req, res, next) {
    try {
      const result = await VehicleService.getVehicles(req.query);
      res.status(200).json(result);
    } catch (err) { next(err); }
  },
  async getById(req, res, next) {
    try {
      const vehicle = await VehicleService.getVehicleById(req.params.id);
      res.status(200).json(vehicle);
    } catch (err) { next(err); }
  },
  async create(req, res, next) {
    try {
      const vehicle = await VehicleService.createVehicle(req.body);
      res.status(201).json(vehicle);
    } catch (err) { next(err); }
  },
  async update(req, res, next) {
    try {
      const vehicle = await VehicleService.updateVehicle(req.params.id, req.body);
      res.status(200).json(vehicle);
    } catch (err) { next(err); }
  },
  async remove(req, res, next) {
    try {
      await VehicleService.deleteVehicle(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  }
};