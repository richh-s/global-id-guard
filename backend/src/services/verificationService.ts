import { query } from '../config/database'
import { verifyWithMock } from '../utils/mockVerifier'
import { VerificationRequest } from '../models/VerificationRequest'

/**
 * Submits a new verification:
 *  - calls the mock AI
 *  - inserts to DB
 */
export async function submitVerification(
  userId: number,
  country: string,
  fileBuffer: Buffer
): Promise<Pick<VerificationRequest, 'id' | 'status' | 'confidence' | 'is_tampered' | 'created_at'>> {
  const ai = await verifyWithMock(fileBuffer)
  const rows = await query<VerificationRequest>(
    `INSERT INTO verification_requests
       (user_id, country_code, status, confidence, is_tampered)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, status, confidence, is_tampered, created_at`,
    [userId, country, ai.status, ai.confidence, ai.isTampered]
  )
  return rows[0]
}

/**
 * Fetches all verifications for a given user.
 */
export async function fetchUserVerifications(
  userId: number
): Promise<VerificationRequest[]> {
  return query<VerificationRequest>(
    'SELECT * FROM verification_requests WHERE user_id=$1 ORDER BY created_at DESC',
    [userId]
  )
}
