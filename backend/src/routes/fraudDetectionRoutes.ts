// src/routes/fraudDetectionRoutes.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { fraudDetailsController } from '../controllers/aiFraudController';

const router = Router();

// GET /api/fraud-detection/:id?mode=mock|live
router.get('/:id', authMiddleware, fraudDetailsController);

export default router;
