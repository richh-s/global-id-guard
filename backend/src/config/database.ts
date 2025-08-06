// src/config/database.ts
import { Pool, QueryResult, QueryResultRow } from 'pg'
import { config } from './index'

// Create and export the Postgres connection pool
export const dbPool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
})

// Simple helper: run a query and return the rows
export async function query<T extends QueryResultRow = any>(
  text: string,
  params: any[] = []
): Promise<T[]> {
  const result: QueryResult<T> = await dbPool.query<T>(text, params)
  return result.rows
}
