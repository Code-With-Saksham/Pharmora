import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Retrieve currently authenticated user profile
router.get('/me', authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
