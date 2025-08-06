// src/controllers/dashboardController.ts
import { Request, Response, NextFunction } from 'express'
import { getDashboardData } from '../services/dashboardService'

/**
 * Returns summary data for the dashboard, varying by user role.
 */
export async function dashboardController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // req.user is populated by authMiddleware (ambiently typed)
    const user = req.user!
    const data = await getDashboardData(user.userId, user.role)
    return res.json(data)
  } catch (err) {
    return next(err)
  }
}
