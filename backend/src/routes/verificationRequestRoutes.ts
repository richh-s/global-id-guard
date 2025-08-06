import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { roleMiddleware } from '../middlewares/roleMiddleware'
import {
  listPendingRequestsController,
  approveRequestController,
  rejectRequestController,
} from '../controllers/verificationRequestsController'

const router = Router()

// Only Inspectors (and Admins, if desired)
router.use(authMiddleware, roleMiddleware('Inspector'))

// List pending requests
router.get('/', listPendingRequestsController)

// Approve
router.put('/:id/approve', approveRequestController)

// Reject
router.put('/:id/reject', rejectRequestController)

export default router
