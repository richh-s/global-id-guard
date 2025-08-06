// src/controllers/addressVerificationController.ts
import { Request, Response, NextFunction } from 'express'
import {
  submitAddressVerification,
  getAddressVerificationResult,
} from '../services/addressVerificationService'

/**
 * Handle submission of a geotagged photo.
 */
export async function submitAddressController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Multer puts the file on req.file
    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' })
    }

    // req.user is injected by authMiddleware (ambiently typed)
    const user = req.user!
    const result = await submitAddressVerification(user.userId, req.file.buffer)
    return res.status(201).json(result)
  } catch (err) {
    return next(err)
  }
}

/**
 * Return the address verification result by ID.
 */
export async function getAddressController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID parameter' })
    }

    const result = await getAddressVerificationResult(id)
    return res.json(result)
  } catch (err) {
    return next(err)
  }
}
