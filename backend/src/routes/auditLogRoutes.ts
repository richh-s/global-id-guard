import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'
import { auditLogController } from '../controllers/auditLogController'

const router = Router()

// Only Admins may view audit logs
router.get('/', authMiddleware, roleMiddleware('Admin'), auditLogController)

export default router
