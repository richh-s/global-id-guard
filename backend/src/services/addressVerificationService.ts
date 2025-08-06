import { query } from '../config/database'
import { verifyWithMock } from '../utils/mockVerifier'

export interface AddressResult {
  id: number
  latitude: number
  longitude: number
  status: string
  confidence: number
  created_at: Date
}

/**
 * Stub: extracts geotag, runs mock AI, and inserts result.
 */
export async function submitAddressVerification(
  userId: number,
  fileBuffer: Buffer
): Promise<AddressResult> {
  // In reality you’d parse EXIF; here, we fake lat/lng
  const latitude = 12.9716
  const longitude = 77.5946
  const ai = await verifyWithMock(fileBuffer)
  const rows = await query<AddressResult>(
    `INSERT INTO address_verifications
       (user_id, latitude, longitude, status, confidence)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [userId, latitude, longitude, ai.status, ai.confidence]
  )
  return rows[0]
}

/**
 * Fetches one address verification record.
 */
export async function getAddressVerificationResult(
  id: number
): Promise<AddressResult> {
  const rows = await query<AddressResult>(
    'SELECT * FROM address_verifications WHERE id=$1',
    [id]
  )
  if (!rows.length) {
    const err = new Error('Not found')
    ;(err as any).statusCode = 404
    throw err
  }
  return rows[0]
}
