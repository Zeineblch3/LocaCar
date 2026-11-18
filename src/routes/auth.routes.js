import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { loginLimiter } from '../middlewares/rate-limit/login.limiter.js';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', loginLimiter, validate(loginSchema), AuthController.login);

export default router;