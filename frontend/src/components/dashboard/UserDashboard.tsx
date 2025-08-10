// src/pages/dashboard/UserDashboard.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { VerificationStatusCard } from '@/components/verification/VerificationStatusCard'
import type { VerificationRequest as UiVerification } from '@/types/verification'
import { Plus, Shield, CheckCircle, Clock, XCircle, FileText, AlertTriangle } from 'lucide-react'

// ---- axios base + auth header (guard against duplicate interceptor installs) ----
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

// ---- backend row -> UI helpers ----
type Row = {
  id: number
  user_id: number
  country_code: 'IN' | 'AU' | 'UK' | string
  status: 'pending' | 'approved' | 'rejected' | string
  ai_status?: 'not_started' | 'queued' | 'running' | 'completed'
  ai_confidence?: number | null
  verification_type?: 'identity' | 'address' | 'employment' | 'business' | string
  document_type?: 'passport' | 'driving_license' | 'utility_bill' | 'employment_letter' | string
  file_name?: string | null
  file_content_type?: string | null
  file_storage_path?: string | null
  created_at: string
  updated_at?: string
  decision_reason?: string | null
}

function toUiStatus(row: Row): UiVerification['status'] {
  if (row.status === 'approved') return 'verified'
  if (row.status === 'rejected') return 'rejected'
  return 'in_review'
}

function toUiCountry(cc?: string): 'india' | 'australia' | 'uk' | undefined {
  switch ((cc || '').toUpperCase()) {
    case 'AU': return 'australia'
    case 'UK': return 'uk'
    case 'IN':
    default:   return 'india'
  }
}

function toUiVerification(row: Row): UiVerification & { decisionReason?: string | null } {
  const docs: UiVerification['documents'] = row.file_name
    ? [{
        id: `${row.id}-0`,
        type: (row.document_type as any) || 'passport',
        filename: row.file_name || 'document',
        url: undefined,
        uploadedAt: row.created_at,
      }]
    : []

  const aiAnalysis =
    row.ai_status === 'completed' && typeof row.ai_confidence === 'number'
      ? {
          confidence: Math.max(0, Math.min(1, row.ai_confidence / 100)),
          isValid: row.status === 'approved',
          extractedData: undefined,
          riskFactors: [],
          analysisTime: row.updated_at || row.created_at,
        }
      : undefined

  return {
    id: String(row.id),
    userId: String(row.user_id),
    type: (row.verification_type as any) || 'identity',
    status: toUiStatus(row),
    documents: docs,
    aiAnalysis,
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
    country: toUiCountry(row.country_code) || 'india',
    decisionReason: row.decision_reason ?? null,
  }
}

// ---- derive the 4 counters purely from /api/verify ----
function deriveCounts(rows: Row[]) {
  let verified = 0, rejected = 0, pending = 0
  for (const r of rows) {
    if (r.status === 'approved') verified++
    else if (r.status === 'rejected') rejected++
    else pending++ // includes brand‑new submissions ⇒ shows up immediately
  }
  return { total: verified + rejected + pending, verified, rejected, pending }
}

export const UserDashboard = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recent, setRecent] = useState<(UiVerification & { decisionReason?: string | null })[]>([])
  const [counts, setCounts] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 })
  const pollRef = useRef<number | null>(null)

  const fetchAll = async () => {
    try {
      setError(null)
      const res = await axios.get<Row[]>('/api/verify')
      const rows = Array.isArray(res.data) ? res.data : []
      setCounts(deriveCounts(rows))
      // newest first, take 5
      const recentUi = rows
        .slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(toUiVerification)
      setRecent(recentUi)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load your dashboard.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('verifyme_token')
    if (!token) {
      setIsLoading(false)
      setRecent([])
      setCounts({ total: 0, verified: 0, pending: 0, rejected: 0 })
      return
    }

    // initial load
    fetchAll()

    // refresh on tab focus (instant feedback after submit/approval/rejection)
    const onFocus = () => fetchAll()
    window.addEventListener('focus', onFocus)

    // gentle polling every 15s (optional; cheap and keeps things fresh)
    pollRef.current = window.setInterval(fetchAll, 15000)

    return () => {
      window.removeEventListener('focus', onFocus)
      if (pollRef.current) window.clearInterval(pollRef.current)
    }
  }, [])

  const stats = useMemo(() => counts, [counts])

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-white/90 text-lg">Track your verification status and manage your identity documents</p>
          </div>
          <Shield className="h-16 w-16 text-white/80" />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '—' : stats.total}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{isLoading ? '—' : stats.verified}</div>
            <p className="text-xs text-muted-foreground">Successfully verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{isLoading ? '—' : stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{isLoading ? '—' : stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Require resubmission</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Start a new verification or manage existing ones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="hero" className="h-auto p-6 flex-col space-y-2">
              <Link to="/verify">
                <Plus className="h-8 w-8" />
                <span className="font-semibold">New Verification</span>
                <span className="text-sm opacity-90">Upload documents for verification</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-6 flex-col space-y-2">
              <Link to="/documents">
                <FileText className="h-8 w-8" />
                <span className="font-semibold">My Documents</span>
                <span className="text-sm opacity-70">View all uploaded documents</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-6 flex-col space-y-2">
              <Link to="/profile">
                <Shield className="h-8 w-8" />
                <span className="font-semibold">Profile Settings</span>
                <span className="text-sm opacity-70">Update your account settings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Verifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Verifications</h2>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/verifications">View All</Link>
            </Button>
            <Button variant="outline" onClick={fetchAll}>Refresh</Button>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">Loading…</CardContent>
          </Card>
        ) : recent.length > 0 ? (
          <div className="grid gap-6">
            {recent.map((verification) => (
              <div key={verification.id}>
                <VerificationStatusCard verification={verification} showDetails={false} />
                {verification.status === 'rejected' && verification.decisionReason ? (
                  <div className="mt-2 text-sm text-destructive">
                    Reason: {verification.decisionReason}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No verifications yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Start your first verification to secure your identity
              </p>
              <Button asChild variant="hero">
                <Link to="/verify">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Verification
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
