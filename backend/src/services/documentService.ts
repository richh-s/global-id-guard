import { query } from '../config/database'
import type { DocumentRow } from '../models/VerificationRequest'
import { promises as fs } from 'fs'

export async function listUserDocuments(userId: number, opts?: { verificationId?: number; docType?: string }) {
  const where: string[] = ['user_id = $1', 'deleted_at IS NULL']
  const params: (number | string)[] = [userId]

  if (opts?.verificationId) {
    where.push('verification_id = $2')
    params.push(opts.verificationId)
  }

  if (opts?.docType) {
    where.push(`doc_type = $${params.length + 1}`)
    params.push(opts.docType)
  }

  const rows = await query<DocumentRow>(
    `SELECT id, user_id, verification_id, doc_type, filename, content_type, size_bytes, uploaded_at
       FROM documents
      WHERE ${where.join(' AND ')}
      ORDER BY uploaded_at DESC`,
    params
  )
  return rows
}

export async function getUserDocument(userId: number, docId: number) {
  const rows = await query<DocumentRow>(
    `SELECT *
       FROM documents
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
    [docId, userId]
  )
  return rows[0] || null
}

export async function softDeleteUserDocument(userId: number, docId: number) {
  const rows = await query<DocumentRow>(
    `UPDATE documents
        SET deleted_at = NOW()
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
      RETURNING id, user_id, verification_id, doc_type, filename, content_type, size_bytes, uploaded_at, deleted_at`,
    [docId, userId]
  )
  return rows[0] || null
}

export async function getDocumentFilePathForStreaming(userId: number, docId: number) {
  const row = await getUserDocument(userId, docId)
  if (!row) return null
  // You could add more checks here for path traversal if needed (we store abs path)
  // Ensure file still exists
  try {
    await fs.access(row.storage_path)
  } catch {
    return null
  }
  return { path: row.storage_path, contentType: row.content_type, filename: row.filename }
}
