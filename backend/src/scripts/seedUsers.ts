// src/scripts/seedUsers.ts
import bcrypt from 'bcrypt'
import { query } from '../config/database'

async function up() {
  const password = 'password'
  const hash = await bcrypt.hash(password, 10)

  // Admin
  await query(
    `INSERT INTO users (email, password, role, name, country)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE
       SET password = EXCLUDED.password,
           role = EXCLUDED.role,
           name = EXCLUDED.name,
           country = EXCLUDED.country`,
    ['admin@verifyme.com', hash, 'admin', 'Admin User', 'IN']
  )

  // Inspector
  await query(
    `INSERT INTO users (email, password, role, name, country)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE
       SET password = EXCLUDED.password,
           role = EXCLUDED.role,
           name = EXCLUDED.name,
           country = EXCLUDED.country`,
    ['inspector@verifyme.com', hash, 'inspector', 'John Inspector', 'AU']
  )

  // Regular User
  await query(
    `INSERT INTO users (email, password, role, name, country)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE
       SET password = EXCLUDED.password,
           role = EXCLUDED.role,
           name = EXCLUDED.name,
           country = EXCLUDED.country`,
    ['user@verifyme.com', hash, 'user', 'Jane User', 'UK']
  )

  console.log('Seeded users (admin/inspector/user) with default password "password"')
}

up()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
