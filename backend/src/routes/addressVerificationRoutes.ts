import { Router } from 'express'
import multer from 'multer'
import { authMiddleware } from '../middlewares/authMiddleware'
import {
  submitAddressController,
  getAddressController,
} from '../controllers/addressVerificationController'

const upload = multer()
const router = Router()

// Submit geotagged photo for address verification
router.post(
  '/',
  authMiddleware,
  upload.single('photo'),
  submitAddressController
)

// Fetch a specific address verification result
router.get('/:id', authMiddleware, getAddressController)

export default router
