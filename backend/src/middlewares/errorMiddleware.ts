import { Request, Response, NextFunction } from 'express'

/**
 * Catches any error thrown in controllers/services,
 * logs it, and sends a standardized error response.
 */
export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err)
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  res.status(statusCode).json({ message })
}
