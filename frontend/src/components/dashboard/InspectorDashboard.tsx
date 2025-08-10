// src/pages/inspector/InspectorDashboard.tsx
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Shield, Eye, CheckCircle, XCircle, FileText, Filter, Search,
} from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

// ---------- Axios base + auth header ----------
axios.defaults.baseURL = import.meta.env?.VITE_API_BASE || 'http://localhost:4000'
const AXIOS_AUTH_INTERCEPTOR = '__verifyme_auth_installed__'
if (!(axios as any)[AXIOS_AUTH_INTERCEPTOR]) {
  axios.interceptors.request.use((cfg) => {
    const t = localStorage.getItem('verifyme_token')
    if (t) cfg.headers.Authorization = `Bearer ${t}`
    return cfg
  })
  ;(axios as any)[AXIOS_AUTH_INTERCEPTOR] = true
}

// Optional: allow overriding the public files base
const PUBLIC_FILE_BASE =
  (import.meta.env as any)?.VITE_PUBLIC_FILE_BASE || `${axios.defaults.baseURL}/files`

// ---------- Types from backend ----------
type Row = {
  id: number
  user_id: number
  country_code: 'IN' | 'AU' | 'UK' | string
  status: 'pending' | 'approved' | 'rejected' | string
  ai_status?: 'not_started' | 'queued' | 'running' | 'completed' | null
  ai_confidence?: number | null
  verification_type?: 'identity' | 'address' | 'employment' | 'business' | string
  document_type?: 'passport' | 'driving_license' | 'utility_bill' | 'employment_letter' | string
  file_name?: string | null
  file_content_type?: string | null
  file_storage_path?: string | null
  file_url?: string | null           // <- controller now returns this
  created_at: string
}

type UiVerification = {
  id: string
  userId: string
  type: 'identity' | 'address' | 'employment' | 'business' | string
  status: 'pending' | 'in_review' | 'verified' | 'rejected'
  country: 'india' | 'australia' | 'uk'
  createdAt: string
  aiConfidence?: number
  fileName?: string | null
  fileType?: string | null
  previewUrl?: string | null         // URL to fetch (server or /files/<name>)
}

function basename(path?: string | null) {
  if (!path) return null
  try { return path.split(/[\\/]/).pop() || null } catch { return null }
}
function toUiCountry(cc: string | undefined): 'india' | 'australia' | 'uk' {
  switch ((cc || '').toUpperCase()) {
    case 'AU': return 'australia'
    case 'UK': return 'uk'
    default:   return 'india'
  }
}
function buildPreviewUrl(r: Row): string | null {
  if (r.file_url) return r.file_url
  const name = basename(r.file_storage_path)
  return name ? `${PUBLIC_FILE_BASE}/${name}` : null
}

function toUi(row: Row): UiVerification {
  const status: UiVerification['status'] =
    row.status === 'approved' ? 'verified'
    : row.status === 'rejected' ? 'rejected'
    : 'in_review'

  const aiConfidence =
    row.ai_status === 'completed' && typeof row.ai_confidence === 'number'
      ? Math.max(0, Math.min(1, row.ai_confidence / 100))
      : undefined

  return {
    id: String(row.id),
    userId: String(row.user_id),
    type: (row.verification_type as any) || 'identity',
    status,
    country: toUiCountry(row.country_code),
    createdAt: row.created_at,
    aiConfidence,
    fileName: row.file_name ?? null,
    fileType: row.file_content_type ?? null,
    previewUrl: buildPreviewUrl(row),
  }
}

// ---------- Component ----------
export const InspectorDashboard = () => {
  const { user } = useAuth()

  const [rows, setRows] = useState<UiVerification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Completed Today — client-side for instant feedback
  const [completedToday, setCompletedToday] = useState(0)

  // Preview modal
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewItem, setPreviewItem] = useState<UiVerification | null>(null)

  // We fetch the file as a blob and create a safe object URL for preview
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  useEffect(() => {
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [objectUrl, previewOpen])

  // Decision modal
  const [decisionOpen, setDecisionOpen] = useState(false)
  const [decisionType, setDecisionType] = useState<'approve' | 'reject' | null>(null)
  const [decisionTargetId, setDecisionTargetId] = useState<string | null>(null)
  const [decisionReason, setDecisionReason] = useState('')

  // Result modal
  const [resultOpen, setResultOpen] = useState(false)
  const [resultTitle, setResultTitle] = useState('')
  const [resultDesc, setResultDesc] = useState('')

  const fetchPending = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get<Row[]>('/api/verification-requests')
      setRows((res.data || []).map(toUi))
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load pending requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPending()
  }, [])

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (v) =>
        v.id.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q) ||
        v.country.toLowerCase().includes(q),
    )
  }, [rows, searchTerm])

  const openDecision = (id: string, type: 'approve' | 'reject') => {
    setDecisionTargetId(id)
    setDecisionType(type)
    setDecisionReason('')
    setDecisionOpen(true)
  }

  const submitDecision = async () => {
    if (!decisionTargetId || !decisionType) return
    const reason = decisionReason.trim()
    if (!reason) {
      setResultTitle('Reason required')
      setResultDesc('Please provide a reason before proceeding.')
      setResultOpen(true)
      return
    }

    try {
      if (decisionType === 'approve') {
        await axios.put(`/api/verification-requests/${decisionTargetId}/approve`, { reason })
      } else {
        await axios.put(`/api/verification-requests/${decisionTargetId}/reject`, { reason })
      }

      setRows((prev) => prev.filter((r) => r.id !== decisionTargetId))
      setCompletedToday((n) => n + 1)

      setResultTitle('Success')
      setResultDesc(decisionType === 'approve'
        ? 'The request has been approved.'
        : 'The request has been rejected.')
      setResultOpen(true)
    } catch (e: any) {
      setResultTitle('Action failed')
      setResultDesc(e?.response?.data?.message || e?.message || 'Please try again.')
      setResultOpen(true)
    } finally {
      setDecisionOpen(false)
    }
  }

  // ---- Preview handler: fetch as blob, create object URL ----
  const handlePreview = async (item: UiVerification) => {
    setPreviewItem(item)
    setPreviewOpen(true)
    // clear previous preview url
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
      setObjectUrl(null)
    }
    if (!item.previewUrl) return
    try {
      const res = await axios.get(item.previewUrl, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      setObjectUrl(url)
    } catch (e) {
      // keep modal open; UI will show "No preview available"
      console.warn('Preview fetch failed:', e)
    }
  }

  const stats = {
    assigned: rows.length,
    completedToday,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inspector Dashboard</h1>
            <p className="text-white/90 text-lg">Review and verify pending identity documents</p>
          </div>
          <Shield className="h-16 w-16 text-white/80" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '—' : stats.assigned}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">Approvals + rejections</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>Documents requiring manual inspection and approval</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search verifications…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm" onClick={fetchPending}>
                <Filter className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error ? (
            <div className="text-destructive">{error}</div>
          ) : loading ? (
            <div className="text-muted-foreground py-8">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-muted-foreground py-8">No pending requests found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left">
                  <tr className="border-b">
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Country</th>
                    <th className="py-2 pr-4">AI Confidence</th>
                    <th className="py-2 pr-4">Submitted</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v) => (
                    <tr key={v.id} className="border-b">
                      <td className="py-2 pr-4 font-mono">{v.id}</td>
                      <td className="py-2 pr-4 capitalize">{v.type}</td>
                      <td className="py-2 pr-4 capitalize">{v.country}</td>
                      <td className="py-2 pr-4">
                        {typeof v.aiConfidence === 'number' ? (
                          <span
                            className={
                              'font-semibold ' +
                              (v.aiConfidence > 0.9
                                ? 'text-success'
                                : v.aiConfidence > 0.7
                                ? 'text-warning'
                                : 'text-destructive')
                            }
                          >
                            {Math.round(v.aiConfidence * 100)}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Pending</span>
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        {new Date(v.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 pr-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            title="Preview"
                            onClick={() => handlePreview(v)}
                            disabled={!v.previewUrl}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => openDecision(v.id, 'approve')} title="Approve">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => openDecision(v.id, 'reject')} title="Reject">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={(open) => {
        if (!open && objectUrl) { URL.revokeObjectURL(objectUrl); setObjectUrl(null) }
        setPreviewOpen(open)
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
            <DialogDescription>
              {previewItem?.fileName || 'Uploaded document'}
            </DialogDescription>
          </DialogHeader>

          {(objectUrl || previewItem?.previewUrl) ? (
            previewItem?.fileType?.startsWith('image/') ? (
              <img
                src={objectUrl || previewItem!.previewUrl!}
                alt={previewItem?.fileName || 'document'}
                className="w-full h-auto rounded-md"
              />
            ) : previewItem?.fileType === 'application/pdf' ? (
              <iframe
                src={objectUrl || previewItem!.previewUrl!}
                title="PDF preview"
                className="w-full h-[70vh] rounded-md"
              />
            ) : (
              <div className="text-sm">
                Preview not supported for this file type.{' '}
                <a className="underline" href={objectUrl || previewItem!.previewUrl!} target="_blank" rel="noreferrer">
                  Download
                </a>
              </div>
            )
          ) : (
            <div className="text-muted-foreground text-sm">No preview available.</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Decision Modal */}
      <Dialog open={decisionOpen} onOpenChange={setDecisionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {decisionType === 'approve' ? 'Approve Verification' : 'Reject Verification'}
            </DialogTitle>
            <DialogDescription>
              Please provide a brief reason. This is saved to the audit log and shared with the user.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={decisionReason}
            onChange={(e) => setDecisionReason(e.target.value)}
            placeholder={decisionType === 'approve' ? 'Reason for approval' : 'Reason for rejection'}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDecisionOpen(false)}>Cancel</Button>
            <Button onClick={submitDecision}>
              {decisionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Result Modal */}
      <Dialog open={resultOpen} onOpenChange={setResultOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{resultTitle}</DialogTitle>
            <DialogDescription>{resultDesc}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setResultOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InspectorDashboard
