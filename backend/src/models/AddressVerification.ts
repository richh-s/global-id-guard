/**
 * Represents a user‐submitted geotagged photo for address verification.
 */
export interface AddressVerification {
    /** Auto‐increment primary key */
    id: number
  
    /** FK to User.id */
    user_id: number
  
    /** Raw latitude/longitude extracted from photo metadata */
    latitude: number
    longitude: number
  
    /** Status: 'pending'|'valid'|'invalid' */
    status: string
  
    /** Confidence score from AI/mock service */
    confidence: number
  
    /** When this record was created */
    created_at: Date
  }
  