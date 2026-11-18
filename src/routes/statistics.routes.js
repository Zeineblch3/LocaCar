import { Router } from 'express';
import { StatisticsController } from '../controllers/statistics.controller.js';
import { authenticate } from '../middlewares/auth/auth.middleware.js';
import { authorize } from '../middlewares/authorize/role.middleware.js';

const router = Router();

router.get('/general', authenticate, authorize(['ADMIN']), StatisticsController.getGeneral);
router.get('/reservations', authenticate, authorize(['ADMIN']), StatisticsController.getReservations);

export default router;