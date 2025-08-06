// src/controllers/fraudDetailsController.ts
import { Request, Response, NextFunction } from 'express'
import { getFraudDetails } from '../services/fraudDetailsService'

/**
 * Fetches and returns metadata about tampered regions for a verification request.
 */
export async function fraudDetailsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid verification ID' })
    }
    const details = await getFraudDetails(id)
    return res.json(details)
  } catch (err) {
    return next(err)
  }
}
