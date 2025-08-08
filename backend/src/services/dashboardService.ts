import { query } from '../config/database'

export async function getDashboardData(userId: number, role: string) {
  if (role === 'Inspector') {
    const pending = await query<{ count: string }>(
      `SELECT COUNT(*) AS count
       FROM verification_requests
       WHERE status IN ('pending','in_review')`
    )
    return { pendingQueue: Number(pending[0].count) }
  }

  if (role === 'Admin') {
    const [users, totalReqs] = await Promise.all([
      query<{ count: string }>(`SELECT COUNT(*) AS count FROM users`),
      query<{ count: string }>(`SELECT COUNT(*) AS count FROM verification_requests`)
    ])
    return { totalUsers: Number(users[0].count), totalRequests: Number(totalReqs[0].count) }
  }

  // User
  const [total, verified, inReview, rejected, recent] = await Promise.all([
    query<{ count: string }>(`SELECT COUNT(*) AS count FROM verification_requests WHERE user_id=$1`, [userId]),
    query<{ count: string }>(`SELECT COUNT(*) AS count FROM verification_requests WHERE user_id=$1 AND status='verified'`, [userId]),
    query<{ count: string }>(`SELECT COUNT(*) AS count FROM verification_requests WHERE user_id=$1 AND status IN ('pending','in_review')`, [userId]),
    query<{ count: string }>(`SELECT COUNT(*) AS count FROM verification_requests WHERE user_id=$1 AND status='rejected'`, [userId]),
    query<any>(`SELECT id, status, country_code, verification_type, document_type, created_at, updated_at
                FROM verification_requests
                WHERE user_id=$1
                ORDER BY created_at DESC
                LIMIT 5`, [userId]),
  ])

  return {
    stats: {
      total: Number(total[0].count),
      verified: Number(verified[0].count),
      pending: Number(inReview[0].count),
      rejected: Number(rejected[0].count),
    },
    recent: recent,
  }
}
