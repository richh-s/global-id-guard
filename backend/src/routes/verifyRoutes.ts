import { Router } from 'express'
import multer from 'multer'
import { authMiddleware } from '../middlewares/authMiddleware'
import {
  submitVerificationController,
  listVerificationsController,
} from '../controllers/verificationController'

const upload = multer()
const router = Router()

// Submit a new document for verification
router.post(
  '/',
  authMiddleware,
  upload.single('file'),
  submitVerificationController
)

// List all verifications for current user
router.get('/', authMiddleware, listVerificationsController)

export default router
