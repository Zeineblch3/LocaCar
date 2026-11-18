import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller.js';
import { authenticate } from '../middlewares/auth/auth.middleware.js';
import { authorize } from '../middlewares/authorize/role.middleware.js';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN', 'AGENT']), CustomerController.getAll);
router.get('/:id', authenticate, authorize(['ADMIN', 'AGENT', 'CLIENT']), CustomerController.getById);
router.put('/:id', authenticate, authorize(['ADMIN', 'CLIENT']), CustomerController.update);

export default router;