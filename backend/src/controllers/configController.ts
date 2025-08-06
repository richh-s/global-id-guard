// src/controllers/configController.ts
import { Request, Response, NextFunction } from 'express'
import { getConfig, updateConfig } from '../services/configService'

/**
 * Return global application configuration.
 */
export async function getConfigController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cfg = await getConfig()
    return res.json(cfg)
  } catch (err) {
    return next(err)
  }
}

/**
 * Update global application configuration.
 */
export async function updateConfigController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const updates = req.body
    const updated = await updateConfig(updates)
    return res.json(updated)
  } catch (err) {
    return next(err)
  }
}
