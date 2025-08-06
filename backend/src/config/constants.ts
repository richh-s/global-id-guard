// Put any truly static values here—nothing that relies on process.env
export enum Role {
    User = 'User',
    Inspector = 'Inspector',
    Admin = 'Admin',
  }
  
  export const SupportedCountries = ['IN', 'AU', 'UK'] as const
  export type CountryCode = typeof SupportedCountries[number]
  
  // Verification statuses
  export enum VerificationStatus {
    Pending = 'pending',
    Valid = 'valid',
    Invalid = 'invalid',
    Approved = 'approved',
    Rejected = 'rejected',
  }
  