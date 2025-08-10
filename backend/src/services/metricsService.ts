import { query } from '../config/database'

type CountryAggRow = { code: string; count: number }
type StatusRow = { status: string; count: number }

function labelFor(code: string) {
  switch (code) {
    case 'IN': return 'India'
    case 'AU': return 'Australia'
    case 'UK': return 'United Kingdom'
    default:   return code
  }
}

export async function getAdminMetrics() {
  // 1) Normalize users.country to canonical codes in SQL, then group
  //    - collapse 'in','IN','India' -> 'IN'
  //    - collapse 'au','AU','Australia' -> 'AU'
  //    - collapse 'uk','UK','gb','GB','United Kingdom' -> 'UK'
  const usersByCode = await query<CountryAggRow>(
    `
    SELECT
      CASE
        WHEN LOWER(TRIM(country)) IN ('in','india') THEN 'IN'
        WHEN LOWER(TRIM(country)) IN ('au','australia') THEN 'AU'
        WHEN LOWER(TRIM(country)) IN ('uk','gb','united kingdom','great britain') THEN 'UK'
        ELSE UPPER(TRIM(country))
      END AS code,
      COUNT(*)::int AS count
    FROM users
    GROUP BY 1
    ORDER BY 1
    `
  )

  const totalUsers = usersByCode.reduce((s, r) => s + Number(r.count), 0)

  const countries = usersByCode.map((r) => {
    const count = Number(r.count)
    const percent = totalUsers ? (count / totalUsers) * 100 : 0
    return {
      code: r.code,
      country: labelFor(r.code), // single, clean label
      count,
      percent,
    }
  })

  // 2) Totals by verification status (already fine, keep lowercasing keys)
  const statusRows = await query<StatusRow>(
    `SELECT status, COUNT(*)::int AS count
     FROM verification_requests
     GROUP BY status`
  )

  const totals = { pending: 0, in_review: 0, approved: 0, rejected: 0 }
  for (const r of statusRows) {
    const k = (r.status || '').toLowerCase()
    if (k in totals) (totals as any)[k] = Number(r.count)
  }

  return { countries, totals }
}
