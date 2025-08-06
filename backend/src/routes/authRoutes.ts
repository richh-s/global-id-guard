import { Router } from 'express'
import { signupController, loginController } from '../controllers/authController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

// Public
router.post('/signup', signupController)
router.post('/login', loginController)

// Protected: get current user
router.get('/user', authMiddleware, (req, res) => {
  const user = req.user!
  res.json({ id: user.userId, role: user.role })
})

export default router
