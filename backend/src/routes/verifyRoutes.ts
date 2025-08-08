import { Router } from 'express'
import multer from 'multer'
import { upload } from '../config/uploads'
import { authMiddleware } from '../middlewares/authMiddleware'
import {
  submitVerificationController,
  listVerificationsController,
  getVerificationController,
} from '../controllers/verificationController'

const multerUpload = multer({ storage: multer.memoryStorage() })
const router = Router()

// Submit a new verification (deferred)

router.post('/', authMiddleware, upload.single('file'), submitVerificationController)

// List all verifications for current user
router.get('/', authMiddleware, listVerificationsController)

// Get one verification by id (own record)
router.get('/:id', authMiddleware, getVerificationController)

export default router
