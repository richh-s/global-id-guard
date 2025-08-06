// src/controllers/verificationController.ts
import { Request, Response, NextFunction } from 'express'
import { submitVerification, fetchUserVerifications } from '../services/verificationService'

/**
 * Handle submission of a document for verification.
 */
export async function submitVerificationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }
    const { country } = req.body
    // `req.user` is injected by authMiddleware (ambiently typed)
    const user = req.user!
    const result = await submitVerification(user.userId, country, req.file.buffer)
    return res.status(201).json(result)
  } catch (err) {
    return next(err)
  }
}

/**
 * List all verifications for the current user.
 */
export async function listVerificationsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!
    const history = await fetchUserVerifications(user.userId)
    return res.json(history)
  } catch (err) {
    return next(err)
  }
}
