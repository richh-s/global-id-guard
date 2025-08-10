// src/services/verificationService.ts
import { query } from '../config/database'
import { VerificationRequest } from '../models/VerificationRequest'

type VerificationType = 'identity' | 'address' | 'employment' | 'business'
type DocumentType =
  | 'passport'
  | 'driving_license'
  | 'utility_bill'
  | 'employment_letter'

const ALLOWED_VERIFICATION: VerificationType[] = [
  'identity',
  'address',
  'employment',
  'business',
]

const ALLOWED_DOCUMENT: DocumentType[] = [
  'passport',
  'driving_license',
  'utility_bill',
  'employment_letter',
]

/**
 * User submits a verification: store as 'pending'; do NOT set AI results.
 * Also writes an audit_logs row with action 'created'.
 */
export async function submitVerification(
  userId: number,
  opts: {
    country: string
    verificationType: VerificationType
    documentType: DocumentType
    file?: { name?: string; contentType?: string; storagePath?: string }
  }
): Promise<Pick<VerificationRequest, 'id' | 'status' | 'created_at'>> {
  // normalize / validate inputs
  const country2 = (opts.country || '').toUpperCase().slice(0, 2)

  if (!ALLOWED_VERIFICATION.includes(opts.verificationType)) {
    throw Object.assign(new Error('Invalid verificationType'), { statusCode: 400 })
  }
  if (!ALLOWED_DOCUMENT.includes(opts.documentType)) {
    throw Object.assign(new Error('Invalid documentType'), { statusCode: 400 })
  }
  if (!country2) {
    throw Object.assign(new Error('country is required'), { statusCode: 400 })
  }

  // Insert as PENDING; AI hasn't started.
  const rows = await query<
    Pick<VerificationRequest, 'id' | 'status' | 'created_at'>
  >(
    `INSERT INTO verification_requests
       (user_id,
        country_code,
        status,
        ai_status,
        verification_type,
        document_type,
        file_name,
        file_content_type,
        file_storage_path)
     VALUES ($1, $2, 'pending', 'not_started', $3, $4, $5, $6, $7)
     RETURNING id, status, created_at`,
    [
      userId,
      country2,
      opts.verificationType,
      opts.documentType,
      opts.file?.name ?? null,
      opts.file?.contentType ?? null,
      opts.file?.storagePath ?? null,
    ]
  )

  const created = rows[0]

  // Write audit log: 'created'
  // (keep metadata small but useful for admins)
  await query(
    `INSERT INTO audit_logs (verification_request_id, actor_user_id, action, metadata)
     VALUES ($1, $2, 'created', $3)`,
    [
      created.id,
      userId,
      JSON.stringify({
        country: country2,
        verificationType: opts.verificationType,
        documentType: opts.documentType,
        file: {
          name: opts.file?.name ?? null,
          contentType: opts.file?.contentType ?? null,
        },
      }),
    ]
  )

  return created
}

/**
 * All verifications for this user (newest first).
 * (Includes file metadata so “My Documents” can be derived if you want.)
 */
export async function fetchUserVerifications(
  userId: number
): Promise<VerificationRequest[]> {
  return query<VerificationRequest>(
    `SELECT *
       FROM verification_requests
      WHERE user_id = $1
      ORDER BY created_at DESC`,
    [userId]
  )
}

/**
 * A single verification row owned by this user.
 */
export async function fetchVerificationById(
  userId: number,
  id: number
): Promise<VerificationRequest | null> {
  const rows = await query<VerificationRequest>(
    `SELECT *
       FROM verification_requests
      WHERE id = $1 AND user_id = $2`,
    [id, userId]
  )
  return rows[0] || null
}
