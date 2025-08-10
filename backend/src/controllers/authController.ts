// src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import { signupService, loginService } from "../services/authService";
import { query } from "../config/database";

export async function signupController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password, confirmPassword, country } = req.body;

    // server‐side confirmPassword check
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (!country) {
      return res
        .status(400)
        .json({ message: "Country is required for signup" });
    }

    const user = await signupService(name, email, password, country);
    // you can omit sending back the password
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginService(email, password);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
}
export async function meController(req: Request, res: Response, next: NextFunction) {
  try {
    const u = req.user!;
    const rows = await query<{ id:number; email:string; role:string; name:string; country:string }>(
      `SELECT id, email, role, name, country FROM users WHERE id=$1`, [u.userId]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (e) { next(e); }
}


