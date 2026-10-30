import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route handlers
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import pharmacyRouter from './routes/pharmacy.js';
import catalogRouter from './routes/catalog.js';
import inventoryRouter from './routes/inventory.js';
import discoveryRouter from './routes/discovery.js';
import cartRouter from './routes/cart.js';

export const createApp = () => {
  const app = express();

  // Basic security and parsing middleware
  app.use(cors({
    origin: env.CLIENT_URL.split(',').map((url) => url.trim()),
    credentials: true,
  }));
  app.use(express.json());
  app.use(requestLogger);

  // Phase 1 API Routes
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);

  // Phase 2 Marketplace & Inventory API Routes
  app.use('/api/pharmacy', pharmacyRouter);
  app.use('/api/catalog', catalogRouter);
  app.use('/api/inventory', inventoryRouter);
  app.use('/api/discovery', discoveryRouter);
  app.use('/api/cart', cartRouter);

  // 404 handler for API routes
  app.use('/api/*', (_req, res) => {
    res.status(404).json({
      success: false,
      error: { message: 'API endpoint not found' },
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
