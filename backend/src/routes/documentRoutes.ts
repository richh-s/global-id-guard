import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { listMyDocumentsController, downloadDocumentController } from '../controllers/documentController'

const router = Router()
router.use(authMiddleware)

router.get('/', listMyDocumentsController)
router.get('/:id/download', downloadDocumentController)

export default router
