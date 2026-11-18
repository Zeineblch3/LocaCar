import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import agencyRoutes from './routes/agency.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import customerRoutes from './routes/customer.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import statisticsRoutes from './routes/statistics.routes.js';

const app = express();

// Sécurité globale
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/statistics', statisticsRoutes);

// Gestionnaire d'erreurs
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  console.log(`Serveur LocaCar démarré sur le port ${ENV.PORT}`);
});

export default app;