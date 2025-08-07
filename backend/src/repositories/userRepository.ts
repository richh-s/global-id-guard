// src/repositories/userRepository.ts
import { query } from "../utils/db";

export interface UserRecord {
  id: number;
  email: string;
  role: string;
  name: string;
  country: string;
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  role: string,
  country: string
): Promise<UserRecord> {
  const rows = await query<UserRecord>(
    `INSERT INTO users (name, email, password, role, country)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, role, name, country`,
    [name, email, password, role, country]
  );
  return rows[0];
}

export async function findUserByEmail(
  email: string
): Promise<(UserRecord & { password: string }) | null> {
  const rows = await query<UserRecord & { password: string }>(
    `SELECT id, email, password, role, name, country
     FROM users
     WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}
