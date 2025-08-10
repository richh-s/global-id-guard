// src/controllers/verificationController.ts
import { Request, Response, NextFunction } from 'express'
import {
  submitVerification,
  fetchUserVerifications,
  fetchVerificationById
} from '../services/verificationService'
import {
  // keep for any places you still need a redacted view
  toUserVerificationDTO,
  // use this for the owner-facing endpoints below
  toUserVerificationOwnerDTO,
} from '../utils/response'

/**
 * User submits a verification (stored as 'pending').
 * Returns minimal info; the client should refetch /api/verify to update counts immediately.
 */
export async function submitVerificationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const { country, verificationType, documentType } = req.body as {
      country: string
      verificationType: 'identity' | 'address' | 'employment' | 'business'
      documentType: 'passport' | 'driving_license' | 'utility_bill' | 'employment_letter'
    }
    if (!country || !verificationType || !documentType) {
      return res
        .status(400)
        .json({ message: 'country, verificationType and documentType are required' })
    }

    const user = req.user!
    const result = await submitVerification(user.userId, {
      country,
      verificationType,
      documentType,
      file: {
        name: req.file.originalname,
        contentType: req.file.mimetype,
        storagePath: (req.file as any).path,
      },
    })

    // Minimal success payload; frontend refetches /api/verify to include the new pending row
    return res.status(201).json({
      id: result.id,
      status: result.status, // 'pending'
      created_at: result.created_at,
      message: 'Verification submitted. You will be notified after review.',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Owner-facing list – includes decision_reason so users can see rejection reasons.
 */
export async function listVerificationsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!
    const history = await fetchUserVerifications(user.userId)
    // IMPORTANT: use the owner DTO so decision_reason is included
    res.json(history.map(toUserVerificationOwnerDTO))
  } catch (err) {
    next(err)
  }
}

/**
 * Owner-facing single item – includes decision_reason.
 */
export async function getVerificationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' })

    const user = req.user!
    const row = await fetchVerificationById(user.userId, id)
    if (!row) return res.status(404).json({ message: 'Not found' })

    // IMPORTANT: use owner DTO (exposes decision_reason to the owner)
    res.json(toUserVerificationOwnerDTO(row))
  } catch (err) {
    next(err)
  }
}
