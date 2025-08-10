// src/pages/documents/Documents.tsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

// Ensure axios always has the auth token
const AXIOS_AUTH_INTERCEPTOR = '__verifyme_docs_auth__'
if (!(axios as any)[AXIOS_AUTH_INTERCEPTOR]) {
  axios.interceptors.request.use((cfg) => {
    const t = localStorage.getItem('verifyme_token')
    if (t) cfg.headers.Authorization = `Bearer ${t}`
    return cfg
  })
  ;(axios as any)[AXIOS_AUTH_INTERCEPTOR] = true
}

type DocRow = {
  id: number
  verification_request_id: number
  document_type?: 'passport' | 'driving_license' | 'utility_bill' | 'employment_letter' | string
  file_name: string | null
  file_content_type: string | null
  file_storage_path: string | null
  created_at: string
}

type UiDoc = {
  id: string
  type: string
  filename: string
  uploadedAt: string
}

export const Documents = () => {
  const [docs, setDocs] = useState<UiDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get<DocRow[]>(`${API_BASE}/api/documents`)
        if (cancelled) return
        const rows = Array.isArray(res.data) ? res.data : []

        const mapped: UiDoc[] = rows
          .filter((r) => r.file_name) // only rows with a stored file
          .map((r) => ({
            id: String(r.id),
            type: r.document_type || 'document',
            filename: r.file_name || 'document',
            uploadedAt: r.created_at,
          }))

        setDocs(mapped)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load documents.')
        setDocs([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="bg-gradient-primary rounded-lg p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Documents</h1>
                <p className="text-white/90 text-lg">
                  View all your uploaded verification documents
                </p>
              </div>
              <FileText className="h-16 w-16 text-white/80" />
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-12 text-center text-muted-foreground">Loading…</div>
              ) : error ? (
                <div className="py-12 text-center text-destructive">{error}</div>
              ) : docs.length > 0 ? (
                <div className="space-y-4">
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <p className="font-medium capitalize">{doc.type} Document</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{doc.filename}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No documents uploaded</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                    Upload your first document to start the verification process
                  </p>
                  <Link
                    to="/verify"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Documents
