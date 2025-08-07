// src/pages/dashboard/UserDashboard.tsx
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { VerificationStatusCard } from '@/components/verification/VerificationStatusCard'
import type { VerificationRequest } from '@/types/verification'
import {
  Plus,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  AlertTriangle,
} from 'lucide-react'

// If you already have a central axios base (e.g. interceptors), you can switch to just axios.get('/api/dashboard').
// Otherwise, set your base URL here:
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

type DashboardApiResponse = {
  totals?: {
    total: number
    verified: number
    pending: number
    rejected: number
  }
  // some earlier versions of our backend used these names
  total?: number
  verified?: number
  in_review?: number
  pending?: number
  rejected?: number

  recentVerifications?: VerificationRequest[]
  recent?: VerificationRequest[] // tolerate alt key
}

export const UserDashboard = () => {
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recent, setRecent] = useState<VerificationRequest[]>([])
  const [counts, setCounts] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
  })

  useEffect(() => {
    let cancelled = false
    const fetchDashboard = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('verifyme_token') || ''
        const res = await axios.get<DashboardApiResponse>(`${API_BASE}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (cancelled) return

        const data = res.data

        // Normalize totals from possible shapes
        const totals =
          data.totals ??
          {
            total: data.total ?? 0,
            verified: data.verified ?? 0,
            pending: (data.pending ?? data.in_review) ?? 0,
            rejected: data.rejected ?? 0,
          }

        setCounts({
          total: totals.total ?? 0,
          verified: totals.verified ?? 0,
          pending: totals.pending ?? 0,
          rejected: totals.rejected ?? 0,
        })

        setRecent(data.recentVerifications ?? data.recent ?? [])
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to load your dashboard. Please try again.'
        )
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchDashboard()
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(
    () => ({
      total: counts.total,
      verified: counts.verified,
      pending: counts.pending,
      rejected: counts.rejected,
    }),
    [counts]
  )

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-white/90 text-lg">
              Track your verification status and manage your identity documents
            </p>
          </div>
          <Shield className="h-16 w-16 text-white/80" />
        </div>
      </div>

      {/* Optional error banner */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
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
          <Button asChild variant="outline">
            <Link to="/verifications">View All</Link>
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">Loading…</CardContent>
          </Card>
        ) : recent.length > 0 ? (
          <div className="grid gap-6">
            {recent.map((verification) => (
              <VerificationStatusCard
                key={verification.id}
                verification={verification}
                onViewDetails={() => console.log('View details:', verification.id)}
              />
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
