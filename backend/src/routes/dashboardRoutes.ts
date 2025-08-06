import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { dashboardController } from '../controllers/dashboardController'

const router = Router()

// Returns role‐based summary data
router.get('/', authMiddleware, dashboardController)

export default router
