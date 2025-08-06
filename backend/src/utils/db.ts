import { Pool, QueryResult, QueryResultRow } from 'pg'
import { config } from '../config'

/**
 * Postgres connection pool.
 * Reuses connections and manages limits.
 */
export const dbPool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
})

/**
 * Simple query helper: executes SQL and returns typed rows.
 * @param text SQL text with `$1`, `$2` placeholders
 * @param params Values for placeholders
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result: QueryResult<T> = await dbPool.query<T>(text, params)
  return result.rows
}
