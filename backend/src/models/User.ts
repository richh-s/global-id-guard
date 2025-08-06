/**
 * Represents a user in the system.
 */
export interface User {
    /** Auto‐increment primary key */
    id: number
  
    /** User’s email (unique) */
    email: string
  
    /** Hashed password */
    password: string
  
    /** Role: 'User' | 'Inspector' | 'Admin' */
    role: string
  
    /** Timestamp when the user was created */
    created_at: Date
  }
  