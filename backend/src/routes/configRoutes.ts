import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'
import {
  getConfigController,
  updateConfigController,
} from '../controllers/configController'

const router = Router()

// Admin-only config endpoints
router.get('/', authMiddleware, roleMiddleware('Admin'), getConfigController)
router.put('/', authMiddleware, roleMiddleware('Admin'), updateConfigController)

export default router
