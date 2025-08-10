// src/services/authService.ts
import bcrypt from "bcrypt"; // use same library as seeder for consistency
import jwt from "jsonwebtoken";
import { config } from "../config";
import { createUser, findUserByEmail, UserRecord } from "../repositories/userRepository";

export interface AuthResult {
  token: string;
  user: Pick<UserRecord, "id" | "email" | "role" | "name" | "country">;
}

export async function signupService(
  name: string,
  email: string,
  password: string,
  country: string
): Promise<Pick<UserRecord, "id" | "email" | "role" | "name" | "country">> {
  const existing = await findUserByEmail(email);
  if (existing) {
    const err = new Error("Email already in use");
    (err as any).statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);

  // Always use lowercase role for consistency
  const role = "user";

  return createUser(name, email, hashed, role, country);
}

export async function loginService(
  email: string,
  password: string
): Promise<AuthResult> {
  const user = await findUserByEmail(email);
  if (!user) {
    const err = new Error("Invalid credentials");
    (err as any).statusCode = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error("Invalid credentials");
    (err as any).statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    config.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      country: user.country,
    },
  };
}
