import { Request, Response, NextFunction } from 'express'
import { getAdminMetrics } from '../services/metricsService'

export async function adminMetricsController(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await getAdminMetrics()
    res.json(data)
  } catch (err) {
    next(err)
  }
}
