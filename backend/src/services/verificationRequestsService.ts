import { query } from '../config/database'
import { VerificationRequest } from '../models/VerificationRequest'

/**
 * Lists all requests with status 'pending'.
 */
export async function listAllRequests(): Promise<VerificationRequest[]> {
  return query<VerificationRequest>(
    "SELECT * FROM verification_requests WHERE status='pending' ORDER BY created_at"
  )
}

/**
 * Marks a pending request approved.
 */
export async function approveRequest(
  requestId: number,
  inspectorId: number
): Promise<VerificationRequest> {
  const rows = await query<VerificationRequest>(
    `UPDATE verification_requests
     SET status='approved'
     WHERE id=$1
     RETURNING *`,
    [requestId]
  )
  // Optionally insert into audit_logs here…
  return rows[0]
}

/**
 * Marks a pending request rejected.
 */
export async function rejectRequest(
  requestId: number,
  inspectorId: number
): Promise<VerificationRequest> {
  const rows = await query<VerificationRequest>(
    `UPDATE verification_requests
     SET status='rejected'
     WHERE id=$1
     RETURNING *`,
    [requestId]
  )
  // Optionally insert into audit_logs here…
  return rows[0]
}
