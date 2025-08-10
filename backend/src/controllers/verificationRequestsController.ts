// src/controllers/verificationRequestsController.ts
import path from 'path'
import type { Request, Response, NextFunction } from 'express'
import {
  listAllRequests,
  approveRequest,
  rejectRequest,
} from '../services/verificationRequestsService'
import { toMinimalDecisionDTO } from '../utils/response'

/** Build a public base for files. If PUBLIC_FILE_BASE is absolute, use it;
 *  otherwise fall back to /files (mounted in app.ts) and also provide absolute. */
function buildFileBases(req: Request) {
  const envBase = process.env.PUBLIC_FILE_BASE || '/files'
  const isAbsolute = /^https?:\/\//i.test(envBase)
  const relBase = isAbsolute ? undefined : envBase // only send if relative
  const absBase = isAbsolute
    ? envBase.replace(/\/+$/, '')
    : `${req.protocol}://${req.get('host')}${envBase.startsWith('/') ? '' : '/'}${envBase}`

  return { relBase: relBase?.replace(/\/+$/, '') || '/files', absBase }
}

/**
 * List all pending verification requests for inspectors.
 * Includes file fields so the UI can preview documents.
 */
export async function listPendingRequestsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const rows = await listAllRequests()
    const { relBase, absBase } = buildFileBases(req)

    const data = rows.map((row: any) => {
      const storagePath: string | null = row.file_storage_path ?? null
      const baseName = storagePath ? path.basename(storagePath) : null

      const file_url = baseName ? `${relBase}/${baseName}` : null
      const file_url_abs = baseName ? `${absBase}/${baseName}` : null

      return {
        id: row.id,
        user_id: row.user_id,
        country_code: row.country_code,
        status: row.status,
        verification_type: row.verification_type,
        document_type: row.document_type,
        created_at: row.created_at,

        // Preview metadata
        file_name: row.file_name ?? null,
        file_content_type: row.file_content_type ?? null,
        file_storage_path: storagePath,
        file_url,       // relative (works when frontend uses API base)
        file_url_abs,   // absolute (works in any origin mix)
      }
    })

    return res.json(data)
  } catch (err) {
    return next(err)
  }
}

/** Normalize/validate a decision reason. */
function getReason(req: Request) {
  const raw =
    typeof req.body?.reason === 'string' ? req.body.reason.trim() : ''
  if (!raw) return null
  // cap to something reasonable to avoid abuse
  return raw.slice(0, 1000)
}

/**
 * Approve a pending request.
 * Body: { reason: string }
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

    const reason = getReason(req)
    if (!reason) {
      return res.status(400).json({ message: 'Reason is required' })
    }

    const user = req.user!
    const updated = await approveRequest(id, user.userId, reason)

    // toMinimalDecisionDTO should include decision_reason, reviewed_by, reviewed_at, updated_at
    return res.json(toMinimalDecisionDTO(updated))
  } catch (err) {
    return next(err)
  }
}

/**
 * Reject a pending request.
 * Body: { reason: string }
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

    const reason = getReason(req)
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
