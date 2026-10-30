import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    product: 'PHARMORA API',
    tagline: 'Your Local Pharmacy. Delivered.',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    services: {
      database: supabaseAdmin ? 'configured' : 'unconfigured',
      auth: supabaseAdmin ? 'configured' : 'unconfigured',
    },
  });
});

export default router;
