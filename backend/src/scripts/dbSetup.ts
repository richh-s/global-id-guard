// src/scripts/dbSetup.ts
import { dbPool } from '../utils/db'

/**
 * Initializes database tables if they don't exist.
 */
async function setup() {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS verification_requests (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      country_code VARCHAR(2) NOT NULL,
      status TEXT NOT NULL,
      confidence INT NOT NULL,
      is_tampered BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      verification_request_id INT REFERENCES verification_requests(id),
      actor_user_id INT REFERENCES users(id),
      action TEXT NOT NULL,
      metadata TEXT,
      timestamp TIMESTAMP DEFAULT NOW()
    )
  `)

  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS address_verifications (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL,
      status TEXT NOT NULL,
      confidence INT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await dbPool.end()
  console.log('Database setup complete')
}

setup().catch(err => {
  console.error('DB setup failed:', err)
  process.exit(1)
})
