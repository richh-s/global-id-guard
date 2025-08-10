import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'
import { adminMetricsController } from '../controllers/metricsController'

const router = Router()

// Admin-only metrics (country distribution + verification totals)
router.get('/admin', authMiddleware, roleMiddleware('admin'), adminMetricsController)

export default router
