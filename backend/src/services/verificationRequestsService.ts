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
  return rows[0]
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
  return rows[0]
}
