import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { fraudDetailsController } from '../controllers/fraudDetailsController'

const router = Router()

// Get fraud-detection metadata for a verification
router.get('/:id', authMiddleware, fraudDetailsController)

export default router
