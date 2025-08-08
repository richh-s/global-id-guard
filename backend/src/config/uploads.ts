import path from 'path'
import fs from 'fs'
import multer from 'multer'
import crypto from 'crypto'

export const UPLOAD_DIR = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads')

// ensure dir exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

// accept only these
const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf',
])

export const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const id = crypto.randomUUID()
      const ext = path.extname(file.originalname || '')
      cb(null, `${id}${ext}`)
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.has(file.mimetype)) return cb(null, true)
    cb(new Error('Unsupported file type'))
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})
