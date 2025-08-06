// src/middlewares/authMiddleware.ts
import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'

// Now correctly a RequestHandler, so Express will accept it
export const authMiddleware: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' })
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as any
    // req.user is allowed by our ambient declaration
    req.user = { userId: payload.userId, role: payload.role }
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
