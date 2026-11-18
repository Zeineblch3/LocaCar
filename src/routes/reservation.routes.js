import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.controller.js';
import { authenticate } from '../middlewares/auth/auth.middleware.js';
import { authorize } from '../middlewares/authorize/role.middleware.js';

const router = Router();

router.post('/', authenticate, authorize(['CLIENT']), ReservationController.create);
router.patch('/:id/cancel', authenticate, authorize(['CLIENT', 'ADMIN', 'AGENT']), ReservationController.cancel);

export default router;