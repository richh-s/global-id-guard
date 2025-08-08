import { Request, Response, NextFunction } from 'express'
import {
  listAllRequests,
  approveRequest,
  rejectRequest,
} from '../services/verificationRequestsService'
import { toMinimalDecisionDTO } from '../utils/response'

export async function listPendingRequestsController(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const list = await listAllRequests()
    // Don’t include decision_reason in list (service/SELECT should avoid it too)
    return res.json(list.map(row => ({
      id: row.id,
      user_id: row.user_id,
      country_code: row.country_code,
      status: row.status,
      verification_type: (row as any).verification_type,
      document_type: (row as any).document_type,
      created_at: row.created_at,
    })))
  } catch (err) {
    return next(err)
  }
}

export async function approveRequestController(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid request ID' })

    const reason = typeof req.body?.reason === 'string' && req.body.reason.trim().length
      ? req.body.reason.trim()
      : null

    if (!reason) {
      return res.status(400).json({ message: 'Reason is required' })
    }

    const user = req.user!
    const updated = await approveRequest(id, user.userId, reason)
    return res.json(toMinimalDecisionDTO(updated))
  } catch (err) {
    return next(err)
  }
}

export async function rejectRequestController(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid request ID' })

    const reason = typeof req.body?.reason === 'string' && req.body.reason.trim().length
      ? req.body.reason.trim()
      : null

    if (!reason) {
      return res.status(400).json({ message: 'Reason is required' })
    }

    const user = req.user!
    const updated = await rejectRequest(id, user.userId, reason)
    return res.json(toMinimalDecisionDTO(updated))
  } catch (err) {
    return next(err)
  }
}
