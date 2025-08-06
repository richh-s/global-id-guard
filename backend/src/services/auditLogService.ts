import { query } from '../config/database'
import { AuditLog } from '../models/AuditLog'

/**
 * Retrieves all audit log entries, ordered by timestamp.
 */
export async function getAuditLogs(): Promise<AuditLog[]> {
  return query<AuditLog>(
    'SELECT * FROM audit_logs ORDER BY timestamp DESC'
  )
}
