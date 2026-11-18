import { ReservationService } from '../services/reservation.service.js';

export const ReservationController = {
  async create(req, res, next) {
    try {
      // Récupération sécurisée du client lié à l'utilisateur authentifié
      const customer = await prisma.customer.findUnique({ where: { userId: req.user.id } });
      if (!customer) return res.status(403).json({ error: 'Profil client requis' });

      const reservation = await ReservationService.createReservation(customer.id, req.body);
      res.status(201).json(reservation);
    } catch (err) {
      next(err);
    }
  },

  async cancel(req, res, next) {
    try {
      const updated = await ReservationService.cancelReservation(req.params.id, req.user.id, req.user.role);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  }
};