import { Request, Response, NextFunction } from 'express'
import {
  submitVerification,
  fetchUserVerifications,
  fetchVerificationById
} from '../services/verificationService'
import { toUserVerificationDTO } from '../utils/response'

export async function submitVerificationController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const { country, verificationType, documentType } = req.body as {
      country: string
      verificationType: 'identity' | 'address' | 'employment' | 'business'
      documentType: 'passport' | 'driving_license' | 'utility_bill' | 'employment_letter'
    }
    if (!country || !verificationType || !documentType) {
      return res.status(400).json({ message: 'country, verificationType and documentType are required' })
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

export async function listVerificationsController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user!
    const history = await fetchUserVerifications(user.userId)
    res.json(history.map(toUserVerificationDTO))
  } catch (err) {
    next(err)
  }
}

export async function getVerificationController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' })

    const user = req.user!
    const row = await fetchVerificationById(user.userId, id)
    if (!row) return res.status(404).json({ message: 'Not found' })

    res.json(toUserVerificationDTO(row))
  } catch (err) {
    next(err)
  }
}
