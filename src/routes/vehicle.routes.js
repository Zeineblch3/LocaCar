import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller.js';
import { authenticate } from '../middlewares/auth/auth.middleware.js';
import { authorize } from '../middlewares/authorize/role.middleware.js';
import { validate } from '../middlewares/validate/validate.middleware.js';
import { vehicleSchema } from '../validators/vehicle.validator.js';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN', 'AGENT', 'CLIENT']), validate(vehicleSchema), VehicleController.getAll);
router.get('/:id', authenticate, authorize(['ADMIN', 'AGENT', 'CLIENT']), VehicleController.getById);
router.post('/', authenticate, authorize(['ADMIN', 'AGENT']), validate(vehicleSchema), VehicleController.create);
router.put('/:id', authenticate, authorize(['ADMIN', 'AGENT']), VehicleController.update);
router.delete('/:id', authenticate, authorize(['ADMIN']), VehicleController.remove);

export default router;