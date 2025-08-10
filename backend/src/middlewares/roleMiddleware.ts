import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Allows only specific roles. Case-insensitive.
 */
export const roleMiddleware = (...allowed: string[]): RequestHandler => {
  // Pre-normalize the allowed list once
  const allowedLower = allowed.map((r) => String(r).toLowerCase())

  return (req: any, res: Response, next: NextFunction) => {
    const role = String(req.user?.role || '').toLowerCase()
    if (!role || !allowedLower.includes(role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' })
    }
    next()
  }
}
