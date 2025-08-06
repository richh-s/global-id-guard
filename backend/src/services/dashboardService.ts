import { query } from '../config/database'
import { VerificationRequest } from '../models/VerificationRequest'

/**
 * Returns summary data for the dashboard, varying by role.
 */
export async function getDashboardData(
  userId: number,
  role: string
): Promise<Record<string, unknown>> {
  if (role === 'Inspector') {
    const pending = await query<VerificationRequest>(
      "SELECT COUNT(*) AS count FROM verification_requests WHERE status='pending'"
    )
    return { pending: Number(pending[0].count) }
  } else if (role === 'Admin') {
    const totalUsers = await query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM users'
    )
    return { totalUsers: Number(totalUsers[0].count) }
  } else {
    // role === 'User'
    const myRequests = await query<VerificationRequest>(
      'SELECT COUNT(*) AS count FROM verification_requests WHERE user_id=$1',
      [userId]
    )
    return { myCount: Number(myRequests[0].count) }
  }
}
