// src/controllers/aiFraudController.ts
import { Request, Response, NextFunction } from 'express';
import { runFraudScan, FraudScanMode } from '../services/aiFraudService';

export async function fraudDetailsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid verification id' });
    }

    const mode = (req.query.mode as FraudScanMode) || 'mock';
    const result = await runFraudScan(id, { mode });

    // result includes signals & scannedAt (typed)
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
