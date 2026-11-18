import { StatisticsService } from '../services/statistics.service.js';

export const StatisticsController = {
  async getGeneral(req, res, next) {
    try {
      const stats = await StatisticsService.getGeneralStats();
      res.status(200).json(stats);
    } catch (err) { next(err); }
  },
  async getReservations(req, res, next) {
    try {
      const year = req.query.year || new Date().getFullYear().toString();
      const stats = await StatisticsService.getReservationStats(year);
      res.status(200).json(stats);
    } catch (err) { next(err); }
  }
};