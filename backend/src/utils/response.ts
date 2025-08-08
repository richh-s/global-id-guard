import type { VerificationRequest } from '../models/VerificationRequest'

export function toUserVerificationDTO(row: VerificationRequest) {
  // No decision_reason here
  return {
    id: row.id,
    user_id: row.user_id,
    country_code: row.country_code,
    status: row.status,
    verification_type: (row as any).verification_type,
    document_type: (row as any).document_type,
    ai_status: (row as any).ai_status ?? 'not_started',
    // No AI outcomes until review policy says so
    created_at: row.created_at,
    updated_at: (row as any).updated_at ?? row.created_at,
    reviewed_by: row.reviewed_by ?? null,
    reviewed_at: row.reviewed_at ?? null,
  }
}

export function toMinimalDecisionDTO(row: VerificationRequest) {
  // What inspector gets back immediately after decision (still no reason)
  return {
    id: row.id,
    status: row.status,
    reviewed_by: row.reviewed_by ?? null,
    reviewed_at: row.reviewed_at ?? null,
    updated_at: (row as any).updated_at ?? row.created_at,
  }
}
