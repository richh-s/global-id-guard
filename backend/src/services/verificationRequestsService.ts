// src/services/verificationRequestsService.ts
import { query } from '../config/database'
import { VerificationRequest } from '../models/VerificationRequest'

/**
 * Pending requests for inspectors.
 * Includes file fields so the client can build a preview URL.
 */
export async function listAllRequests(): Promise<VerificationRequest[]> {
  return query<VerificationRequest>(
    `SELECT
       id,
       user_id,
       country_code,
       status,
       verification_type,
       document_type,
       file_name,
       file_content_type,
       file_storage_path,
       created_at,
       updated_at
     FROM verification_requests
     WHERE status = 'pending'
     ORDER BY created_at`
  )
}

/**
 * Approve a pending request with a reason (required).
 * Returns the updated row, including decision_reason & updated_at.
 */
export async function approveRequest(
  requestId: number,
  inspectorId: number,
  reason: string
): Promise<VerificationRequest> {
  const rows = await query<VerificationRequest>(
    `UPDATE verification_requests
       SET status = 'approved',
           reviewed_by = $2,
           reviewed_at = NOW(),
           decision_reason = $3
     WHERE id = $1 AND status = 'pending'
     RETURNING
       id,
       user_id,
       country_code,
       status,
       verification_type,
       document_type,
       decision_reason,         -- ✅ return reason
       created_at,
       reviewed_by,
       reviewed_at,
       updated_at                -- ✅ for client-side freshness
    `,
    [requestId, inspectorId, reason]
  )

  if (!rows.length) {
    const err = new Error('Not found or not pending')
    ;(err as any).statusCode = 404
    throw err
  }

  const updated = rows[0]

  // Write audit log
  await query(
    `INSERT INTO audit_logs (verification_request_id, actor_user_id, action, metadata)
     VALUES ($1, $2, 'approved', $3)`,
    [
      updated.id,
      inspectorId,
      JSON.stringify({
        reason,
        country: (updated as any).country_code,
        verificationType: (updated as any).verification_type,
        documentType: (updated as any).document_type,
      }),
    ]
  )

  return updated
}

/**
 * Reject a pending request with a reason (required).
 * Returns the updated row, including decision_reason & updated_at.
 */
export async function rejectRequest(
  requestId: number,
  inspectorId: number,
  reason: string
): Promise<VerificationRequest> {
  const rows = await query<VerificationRequest>(
    `UPDATE verification_requests
       SET status = 'rejected',
           reviewed_by = $2,
           reviewed_at = NOW(),
           decision_reason = $3
     WHERE id = $1 AND status = 'pending'
     RETURNING
       id,
       user_id,
       country_code,
       status,
       verification_type,
       document_type,
       decision_reason,         -- ✅ return reason
       created_at,
       reviewed_by,
       reviewed_at,
       updated_at                -- ✅ for client-side freshness
    `,
    [requestId, inspectorId, reason]
  )

  if (!rows.length) {
    const err = new Error('Not found or not pending')
    ;(err as any).statusCode = 404
    throw err
  }

  const updated = rows[0]

  // Write audit log
  await query(
    `INSERT INTO audit_logs (verification_request_id, actor_user_id, action, metadata)
     VALUES ($1, $2, 'rejected', $3)`,
    [
      updated.id,
      inspectorId,
      JSON.stringify({
        reason,
        country: (updated as any).country_code,
        verificationType: (updated as any).verification_type,
        documentType: (updated as any).document_type,
      }),
    ]
  )

  return updated
}
