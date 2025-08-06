// src/repositories/userRepository.ts
import { query } from '../utils/db'
import { User } from '../models/User'

/**
 * Inserts a new user and returns the inserted row (minus password).
 */
export async function createUser(
  email: string,
  hashed: string,
  role: string
): Promise<Pick<User, 'id' | 'email' | 'role'>> {
  const rows = await query<User>(
    'INSERT INTO users(email,password,role) VALUES($1,$2,$3) RETURNING id,email,role',
    [email, hashed, role]
  )
  return rows[0]
}

/**
 * Finds a user by email, returning the full row including password.
 */
export async function findUserByEmail(
  email: string
): Promise<User | null> {
  const rows = await query<User>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )
  return rows[0] ?? null
}
