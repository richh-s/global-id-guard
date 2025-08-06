// src/controllers/auditLogController.ts
import { Request, Response, NextFunction } from 'express'
import { getAuditLogs } from '../services/auditLogService'

/**
 * Returns a chronological list of all audit log entries.
 */
export async function auditLogController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const logs = await getAuditLogs()
    return res.json(logs)
  } catch (err) {
    return next(err)
  }
}
