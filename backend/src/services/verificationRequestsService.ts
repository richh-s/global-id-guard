// src/services/verificationRequestsService.ts
import { query } from '../config/database'
import { VerificationRequest } from '../models/VerificationRequest'

export async function listAllRequests(): Promise<VerificationRequest[]> {
  // Don’t SELECT decision_reason
  return query<VerificationRequest>(
    `SELECT id, user_id, country_code, status, verification_type, document_type, created_at
     FROM verification_requests
     WHERE status='pending'
     ORDER BY created_at`
  )
}

export async function approveRequest(
  requestId: number,
  inspectorId: number,
  reason: string
): Promise<VerificationRequest> {
  const rows = await query<VerificationRequest>(
    `UPDATE verification_requests
       SET status='approved',
           reviewed_by=$2,
           reviewed_at=NOW(),
           decision_reason=$3
     WHERE id=$1 AND status='pending'
     RETURNING id, user_id, country_code, status, verification_type, document_type,
               created_at, reviewed_by, reviewed_at`,
    [requestId, inspectorId, reason]
  )
  if (!rows.length) {
    const err = new Error('Not found or not pending')
    ;(err as any).statusCode = 404
    throw err
  }

  const updated = rows[0]

  // Audit log for approval
  await query(
    `INSERT INTO audit_logs (verification_request_id, actor_user_id, action, metadata)
     VALUES ($1, $2, 'approved', $3)`,
    [
      updated.id,
      inspectorId,
      JSON.stringify({
        reason,
        country: updated.country_code,
        verificationType: updated.verification_type,
        documentType: updated.document_type
      })
    ]
  )

  return updated
}

export async function rejectRequest(
  requestId: number,
  inspectorId: number,
  reason: string
): Promise<VerificationRequest> {
  const rows = await query<VerificationRequest>(
    `UPDATE verification_requests
       SET status='rejected',
           reviewed_by=$2,
           reviewed_at=NOW(),
           decision_reason=$3
     WHERE id=$1 AND status='pending'
     RETURNING id, user_id, country_code, status, verification_type, document_type,
               created_at, reviewed_by, reviewed_at`,
    [requestId, inspectorId, reason]
  )
  if (!rows.length) {
    const err = new Error('Not found or not pending')
    ;(err as any).statusCode = 404
    throw err
  }

  const updated = rows[0]

  // Audit log for rejection
  await query(
    `INSERT INTO audit_logs (verification_request_id, actor_user_id, action, metadata)
     VALUES ($1, $2, 'rejected', $3)`,
    [
      updated.id,
      inspectorId,
      JSON.stringify({
        reason,
        country: updated.country_code,
        verificationType: updated.verification_type,
        documentType: updated.document_type
      })
    ]
  )

  return updated
}
