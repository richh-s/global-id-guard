import path from 'path'
import { Request, Response, NextFunction } from 'express'
import { query } from '../config/database'
import { UPLOAD_DIR } from '../config/uploads'

export async function listMyDocumentsController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user!
    const rows = await query(
      `SELECT id as verification_id,
              verification_type,
              document_type,
              file_name,
              file_content_type,
              file_storage_path,
              created_at
       FROM verification_requests
       WHERE user_id=$1 AND file_storage_path IS NOT NULL
       ORDER BY created_at DESC`,
      [user.userId]
    )
    // Optional: include a public URL
    const base = process.env.PUBLIC_FILE_BASE || '/files'
    const data = rows.map((r: any) => ({
      ...r,
      file_url: r.file_storage_path
        ? `${base}/${path.basename(r.file_storage_path)}`
        : null,
    }))
    res.json(data)
  } catch (e) { next(e) }
}

export async function downloadDocumentController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user!
    const id = Number(req.params.id)
    const rows = await query(
      `SELECT file_name, file_storage_path
       FROM verification_requests
       WHERE id=$1 AND user_id=$2 AND file_storage_path IS NOT NULL`,
      [id, user.userId]
    )
    if (!rows.length) return res.status(404).json({ message: 'Not found' })
    const file = rows[0]
    res.download(file.file_storage_path, file.file_name)
  } catch (e) { next(e) }
}
