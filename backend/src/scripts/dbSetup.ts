import { dbPool } from '../utils/db'

async function setup() {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      country VARCHAR(50) NOT NULL DEFAULT 'IN',
      created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
    );
  `)

  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS verification_requests (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id),
      country_code VARCHAR(2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      ai_confidence INT,
      ai_is_tampered BOOLEAN,
      ai_status TEXT NOT NULL DEFAULT 'not_started',
      verification_type TEXT NOT NULL DEFAULT 'identity',
      document_type TEXT NOT NULL DEFAULT 'passport',
      reviewed_by INT REFERENCES users(id),
      reviewed_at TIMESTAMPTZ,
      decision_reason TEXT,
      file_name TEXT,
      file_content_type TEXT,
      file_storage_path TEXT,
      created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `)

  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      verification_request_id INT REFERENCES verification_requests(id),
      actor_user_id INT REFERENCES users(id),
      action TEXT NOT NULL,
      metadata TEXT,
      timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
    );
  `)

  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS address_verifications (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id),
      latitude DOUBLE PRECISION NOT NULL,
      longitude DOUBLE PRECISION NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      ai_confidence INT,
      ai_status TEXT NOT NULL DEFAULT 'not_started',
      reviewed_by INT REFERENCES users(id),
      reviewed_at TIMESTAMPTZ,
      decision_reason TEXT,
      country_code VARCHAR(2),
      photo_file_name TEXT,
      photo_content_type TEXT,
      photo_storage_path TEXT,
      created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
    );
  `)

  // updated_at trigger for verification_requests
  await dbPool.query(`
    CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END $$ LANGUAGE plpgsql;
  `)
  await dbPool.query(`
    DROP TRIGGER IF EXISTS trg_ver_req_set_updated ON verification_requests;
    CREATE TRIGGER trg_ver_req_set_updated
    BEFORE UPDATE ON verification_requests
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `)

  await dbPool.end()
  console.log('Database setup complete')
}

setup().catch(err => {
  console.error('DB setup failed:', err)
  process.exit(1)
})
