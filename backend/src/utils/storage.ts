import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
}

export function generateSafeFilename(original: string) {
  const ext = path.extname(original) || ''
  const base = crypto.randomBytes(16).toString('hex')
  return `${base}${ext}`
}

export async function saveBufferToDisk(buffer: Buffer, originalName: string) {
  await ensureUploadDir()
  const filename = generateSafeFilename(originalName)
  const absPath = path.join(UPLOAD_DIR, filename)
  await fs.writeFile(absPath, buffer)

  const checksum = crypto.createHash('sha256').update(buffer).digest('hex')
  return { storagePath: absPath, checksum }
}
