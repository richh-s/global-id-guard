import { query } from '../config/database';

export async function getDashboardData(userId: number, role: string) {
  const r = String(role || '').toLowerCase();

  if (r === 'inspector') {
    const pending = await query<{ count: string }>(`
      SELECT COUNT(*) AS count
      FROM verification_requests
      WHERE status IN ('pending','in_review')`);
    return { pendingQueue: Number(pending[0].count) };
  }

  if (r === 'admin') {
    const [users, totalReqs, pendingReviews] = await Promise.all([
      query<{ count: string }>(`SELECT COUNT(*) AS count FROM users`),
      query<{ count: string }>(`SELECT COUNT(*) AS count FROM verification_requests`),
      query<{ count: string }>(`SELECT COUNT(*) AS count FROM verification_requests WHERE status IN ('pending','in_review')`),
    ]);
    return {
      totalUsers: Number(users[0].count),
      totalRequests: Number(totalReqs[0].count),
      pendingReviews: Number(pendingReviews[0].count),
    };
  }

  const [total, approved, inReview, rejected, recent] = await Promise.all([
    query<{ count: string }>(`SELECT COUNT(*) AS count FROM verification_requests WHERE user_id=$1`, [userId]),
    query<{ count: string }>(`SELECT COUNT(*) AS count FROM verification_requests WHERE user_id=$1 AND status='approved'`, [userId]),
    query<{ count: string }>(`SELECT COUNT(*) AS count FROM verification_requests WHERE user_id=$1 AND status IN ('pending','in_review')`, [userId]),
    query<{ count: string }>(`SELECT COUNT(*) AS count FROM verification_requests WHERE user_id=$1 AND status='rejected'`, [userId]),
    query<any>(`SELECT id,status,country_code,verification_type,document_type,created_at,updated_at
                FROM verification_requests WHERE user_id=$1 ORDER BY created_at DESC LIMIT 5`, [userId]),
  ]);

  return {
    stats: {
      total: Number(total[0].count),
      verified: Number(approved[0].count), // map DB 'approved' -> UI 'verified'
      pending: Number(inReview[0].count),
      rejected: Number(rejected[0].count),
    },
    recent,
  };
}
