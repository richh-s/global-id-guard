// src/pages/inspector/InspectorDashboard.tsx
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Filter,
  Search,
} from 'lucide-react'
import { Input } from '@/components/ui/input'

// ---------- Axios base + auth header ----------
axios.defaults.baseURL = import.meta.env?.VITE_API_BASE || 'http://localhost:4000'
axios.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('verifyme_token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

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
}

// ---------- helpers ----------
function toUiCountry(cc: string | undefined): 'india' | 'australia' | 'uk' {
  switch ((cc || '').toUpperCase()) {
    case 'AU':
      return 'australia'
    case 'UK':
      return 'uk'
    default:
      return 'india'
  }
}

function toUi(row: Row): UiVerification {
  const status: UiVerification['status'] =
    row.status === 'approved'
      ? 'verified'
      : row.status === 'rejected'
      ? 'rejected'
      : 'in_review' // treat 'pending' as in_review in UI

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
  }
}

// ---------- Component ----------
export const InspectorDashboard = () => {
  const { user } = useAuth()

  const [rows, setRows] = useState<UiVerification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchPending = async () => {
    setLoading(true)
    setError(null)
    try {
      // Inspector-only endpoint (from your Postman run)
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

  // ---- Approve/Reject handlers ----
  const handleApprove = async (id: string) => {
    // If your backend accepts approve without a reason, you can remove this prompt.
    const reason = window.prompt('Enter approval reason (required):') || ''
    if (!reason.trim()) {
      alert('Approval reason is required.')
      return
    }
    try {
      await axios.put(`/api/verification-requests/${id}/approve`, { reason })
      // Remove from list (no longer pending)
      setRows((prev) => prev.filter((r) => r.id !== id))
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || 'Approve failed')
    }
  }

  const handleReject = async (id: string) => {
    const reason = window.prompt('Enter rejection reason (required):') || ''
    if (!reason.trim()) {
      alert('Rejection reason is required.')
      return
    }
    try {
      await axios.put(`/api/verification-requests/${id}/reject`, { reason })
      setRows((prev) => prev.filter((r) => r.id !== id))
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || 'Reject failed')
    }
  }

  // Simple inspector stats derived from list
  const stats = {
    assigned: rows.length,
    completedToday: '—', // keep placeholder unless you add a backend metric
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

      {/* Stats (removed Avg. Review Time & Accuracy Rate) */}
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
            <p className="text-xs text-muted-foreground">—</p>
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
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
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
                          <Button variant="outline" size="sm" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => handleApprove(v.id)} title="Approve">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(v.id)}
                            title="Reject"
                          >
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
    </div>
  )
}

export default InspectorDashboard
