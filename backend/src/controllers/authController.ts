import { Request, Response, NextFunction } from 'express'
import { signupService, loginService } from '../services/authService'

export async function signupController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, role } = req.body
    const user = await signupService(email, password, role)
    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body
    const result = await loginService(email, password)
    res.json(result)
  } catch (err) {
    next(err)
  }
}
