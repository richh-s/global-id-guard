// src/controllers/verificationRequestsController.ts
import { Request, Response, NextFunction } from 'express'
import {
  listAllRequests,
  approveRequest,
  rejectRequest,
} from '../services/verificationRequestsService'

/**
 * Lists all pending verification requests.
 */
export async function listPendingRequestsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const list = await listAllRequests()
    return res.json(list)
  } catch (err) {
    return next(err)
  }
}

/**
 * Approves a specific verification request.
 */
export async function approveRequestController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid request ID' })
    }
    // req.user is populated by authMiddleware
    const user = req.user!
    const updated = await approveRequest(id, user.userId)
    return res.json(updated)
  } catch (err) {
    return next(err)
  }
}

/**
 * Rejects a specific verification request.
 */
export async function rejectRequestController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid request ID' })
    }
    const user = req.user!
    const updated = await rejectRequest(id, user.userId)
    return res.json(updated)
  } catch (err) {
    return next(err)
  }
}
