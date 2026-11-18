import { Router } from 'express';
import { AgencyController } from '../controllers/agency.controller.js';
import { authenticate } from '../middlewares/auth/auth.middleware.js';
import { authorize } from '../middlewares/authorize/role.middleware.js';
import { validate } from '../middlewares/validate/validate.middleware.js';
import { agencySchema, agencyUpdateSchema } from '../validators/agency.validator.js';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN', 'AGENT', 'CLIENT']), AgencyController.getAll);
router.get('/:id', authenticate, authorize(['ADMIN', 'AGENT', 'CLIENT']), AgencyController.getById);
router.post('/', authenticate, authorize(['ADMIN']), validate(agencySchema), AgencyController.create);
router.put('/:id', authenticate, authorize(['ADMIN']), validate(agencyUpdateSchema), AgencyController.update);
router.delete('/:id', authenticate, authorize(['ADMIN']), AgencyController.remove);

export default router;