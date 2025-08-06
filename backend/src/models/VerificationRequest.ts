import { CountryCode } from '../config/constants'

/**
 * Represents a single identity‐verification request.
 */
export interface VerificationRequest {
  [x: string]: any
  /** Auto‐increment primary key */
  id: number

  /** FK to User.id */
  user_id: number

  /** Country code ('IN'|'AU'|'UK') */
  country_code: CountryCode

  /** Status: 'pending'|'valid'|'invalid'|'approved'|'rejected' */
  status: string

  /** Confidence score from AI/mock service */
  confidence: number

  /** Whether the document was flagged as tampered */
  is_tampered: boolean

  /** When this record was created */
  created_at: Date
}
