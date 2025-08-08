import { query } from '../config/database'

export interface AddressResult {
  id: number
  user_id: number
  latitude: number
  longitude: number
  status: string
  ai_confidence: number | null
  ai_status: 'not_started' | 'running' | 'done' | 'failed'
  created_at: Date
}

/**
 * Deferred: store record as pending, no immediate AI.
 */
export async function submitAddressVerification(
  userId: number,
  fileBuffer: Buffer,
  fileName?: string,
  contentType?: string,
  countryCode?: string
): Promise<Pick<AddressResult, 'id' | 'status' | 'created_at'>> {
  // (Real impl would extract EXIF; we leave lat/lng null-safe defaults or mock)
  const latitude = 12.9716
  const longitude = 77.5946

  const rows = await query<AddressResult>(
    `INSERT INTO address_verifications
       (user_id, latitude, longitude, status, ai_status, photo_file_name, photo_content_type, country_code)
     VALUES ($1,$2,$3,'pending','not_started',$4,$5,$6)
     RETURNING id, status, created_at`,
    [userId, latitude, longitude, fileName || null, contentType || null, countryCode || null]
  )
  return rows[0]
}

export async function getAddressVerificationResult(id: number): Promise<AddressResult> {
  const rows = await query<AddressResult>(
    `SELECT * FROM address_verifications WHERE id=$1`,
    [id]
  )
  if (!rows.length) {
    const err = new Error('Not found')
    ;(err as any).statusCode = 404
    throw err
  }
  return rows[0]
}
