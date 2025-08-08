import { CountryCode } from '../config/constants'

export interface VerificationRequest {
  id: number
  user_id: number
  country_code: CountryCode

  // lifecycle
  status: 'pending' | 'in_review' | 'verified' | 'rejected'
  created_at: Date
  updated_at: Date

  // AI (nullable until processed)
  ai_confidence: number | null
  ai_is_tampered: boolean | null
  ai_status: 'not_started' | 'running' | 'done' | 'failed'

  // User intent
  verification_type: 'identity' | 'address' | 'employment' | 'business'
  document_type: 'passport'  | 'driving_license' | 'utility_bill' | 'employment_letter'

  // Review data
  reviewed_by: number | null
  reviewed_at: Date | null
  decision_reason: string | null

  // File refs
  file_name: string | null
  file_content_type: string | null
  file_storage_path: string | null
}

export interface AddressVerification {
  id: number
  user_id: number
  latitude: number
  longitude: number
  status: 'pending' | 'in_review' | 'verified' | 'rejected'
  ai_confidence: number | null
  ai_status: 'not_started' | 'running' | 'done' | 'failed'
  reviewed_by: number | null
  reviewed_at: Date | null
  decision_reason: string | null
  country_code: CountryCode | null
  photo_file_name: string | null
  photo_content_type: string | null
  photo_storage_path: string | null
  created_at: Date
}
export interface DocumentRow {
  id: number
  user_id: number
  verification_id: number | null
  doc_type: string
  filename: string
  content_type: string
  size_bytes: number
  storage_path: string
  checksum_sha256: string | null
  uploaded_at: Date
  deleted_at: Date | null
}
