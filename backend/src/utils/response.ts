import type { VerificationRequest } from '../models/VerificationRequest'

/**
 * For public/inspector list views – excludes decision_reason for privacy.
 */
export function toUserVerificationDTO(row: VerificationRequest) {
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

/**
 * For inspectors immediately after making a decision – still hides decision_reason.
 */
export function toMinimalDecisionDTO(row: VerificationRequest) {
  return {
    id: row.id,
    status: row.status,
    reviewed_by: row.reviewed_by ?? null,
    reviewed_at: row.reviewed_at ?? null,
    updated_at: (row as any).updated_at ?? row.created_at,
  }
}

/**
 * For the owner (logged-in user) – includes decision_reason so they can see why it was rejected.
 */
export function toUserVerificationOwnerDTO(row: VerificationRequest) {
  return {
    id: row.id,
    user_id: row.user_id,
    country_code: row.country_code,
    status: row.status,
    verification_type: (row as any).verification_type,
    document_type: (row as any).document_type,
    ai_status: (row as any).ai_status ?? 'not_started',
    created_at: row.created_at,
    updated_at: (row as any).updated_at ?? row.created_at,
    reviewed_by: row.reviewed_by ?? null,
    reviewed_at: row.reviewed_at ?? null,
    decision_reason: row.decision_reason ?? null, // <-- now included
    file_name: (row as any).file_name ?? null,
    file_content_type: (row as any).file_content_type ?? null,
    file_storage_path: (row as any).file_storage_path ?? null,
  }
}
