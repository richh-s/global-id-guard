/**
 * Records every verification‐related action (create, approve, reject).
 */
export interface AuditLog {
    /** Auto‐increment primary key */
    id: number
  
    /** Which verification request was acted on */
    verification_request_id: number
  
    /** User who performed the action (could be the uploader or an inspector) */
    actor_user_id: number
  
    /** Action type: 'created'|'approved'|'rejected' */
    action: string
  
    /** Additional metadata or comments (optional) */
    metadata?: string
  
    /** When the action occurred */
    timestamp: Date
  }
  