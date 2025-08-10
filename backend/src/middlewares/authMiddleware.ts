import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'

export const authMiddleware: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' })
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as any
    // Always normalize here
    const userId = payload.userId
    const role = String(payload.role || '').toLowerCase()

    if (!userId || !role) {
      return res.status(401).json({ message: 'Invalid token payload' })
    }

    // req.user is allowed by ambient declaration
    req.user = { userId, role }
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
