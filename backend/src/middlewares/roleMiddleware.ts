// src/middlewares/roleMiddleware.ts
import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Creates middleware that allows only specific roles to proceed.
 * @param allowedRoles One or more roles permitted for this route.
 */
export const roleMiddleware = (...allowedRoles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // `req.user` is injected by authMiddleware and is optional on Request
    const userRole = req.user?.role
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' })
    }
    next()
  }
}
