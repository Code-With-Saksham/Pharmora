import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';

export const createApp = () => {
  const app = express();

  // Basic security and parsing middleware
  app.use(cors({
    origin: env.CLIENT_URL.split(',').map((url) => url.trim()),
    credentials: true,
  }));
  app.use(express.json());
  app.use(requestLogger);

  // API Routes
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);

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
