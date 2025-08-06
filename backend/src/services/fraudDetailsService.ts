import { query } from '../config/database'

export interface FraudDetail {
  region: string
  confidence: number
}

/**
 * Stub: returns metadata for tampered regions.
 */
export async function getFraudDetails(
  verificationId: number
): Promise<FraudDetail[]> {
  // In a real scenario, pull metadata from a separate table or JSONB field
  return [
    { region: 'upper-left', confidence: 0.65 },
    { region: 'lower-right', confidence: 0.45 },
  ]
}
