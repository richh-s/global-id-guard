// src/components/dashboard/AdminDashboard.tsx
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Shield,
  Users,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  Activity,
  Eye,
  Download,
  Filter,
} from 'lucide-react';

// ---------- axios base ----------
axios.defaults.baseURL = import.meta.env?.VITE_API_BASE || 'http://localhost:4000';
axios.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('verifyme_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// ---------- API shapes ----------
type AdminDashboardAPI = {
  totalUsers?: number;
  totalRequests?: number;
  pendingReviews?: number;
  // optional: if you merged metrics into dashboard, these may exist too:
  countries?: { country: string; count: number; percent: number }[];
  totals?: { pending: number; in_review: number; approved: number; rejected: number };
};

type AuditLogDb = {
  id: number;
  verification_request_id: number | null;
  actor_user_id: number | null;
  action: string;
  metadata?: string | null;
  timestamp: string; // ISO
};

type AuditLogUI = {
  id: string;
  userId: string;
  action: string;
  details: unknown;
  timestamp: string;
  ipAddress?: string | null; // not provided by API; placeholder for UI
};

type MetricsAPI = {
  countries: { country: string; count: number; percent: number }[];
  totals: { pending: number; in_review: number; approved: number; rejected: number };
};

// ---------- helpers ----------
function parseMetadata(meta?: string | null): unknown {
  if (!meta) return {};
  try {
    return JSON.parse(meta);
  } catch {
    return { raw: meta };
  }
}

function toUI(log: AuditLogDb): AuditLogUI {
  return {
    id: String(log.id),
    userId: log.actor_user_id != null ? String(log.actor_user_id) : '—',
    action: (log.action || '').toUpperCase(),
    details: parseMetadata(log.metadata),
    timestamp: log.timestamp,
    ipAddress: null,
  };
}

function formatPercent(n?: number) {
  if (typeof n !== 'number' || Number.isNaN(n)) return '0%';
  return `${n.toFixed(2)}%`;
}

// ========== Component ==========
export const AdminDashboard = () => {
  const { user } = useAuth();
  const role = (user?.role || '').toLowerCase();

  const [dashboard, setDashboard] = useState<AdminDashboardAPI | null>(null);
  const [metrics, setMetrics] = useState<MetricsAPI | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (role !== 'admin') {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const [dashRes, logsRes, metricsRes] = await Promise.all([
          axios.get<AdminDashboardAPI>('/api/dashboard'),
          axios.get<AuditLogDb[]>('/api/audit-logs'),
          axios.get<MetricsAPI>('/api/metrics/admin'), // countries + totals
        ]);
        if (!mounted) return;

        setDashboard(dashRes.data || null);
        setAuditLogs((logsRes.data || []).map(toUI));
        setMetrics(metricsRes.data || null);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || e?.message || 'Failed to load admin dashboard.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [role]);

  // Derive admin metrics safely
  const totalUsers =
    dashboard?.totalUsers != null ? dashboard.totalUsers :
    undefined;

  const totalRequests =
    dashboard?.totalRequests != null ? dashboard.totalRequests :
    undefined;

  const pendingReviews =
    dashboard?.pendingReviews != null ? dashboard.pendingReviews :
    undefined;

  // From /api/metrics/admin (countries + verification status totals)
  const countryRows = metrics?.countries ?? dashboard?.countries ?? [];
  const statusTotals = metrics?.totals ?? dashboard?.totals ?? {
    pending: undefined,
    in_review: undefined,
    approved: undefined,
    rejected: undefined,
  };

  // Best‑effort fraud metric: count REJECTED actions from logs in last 30 days
  const fraudLast30 = useMemo(() => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return auditLogs.filter(
      (l) => l.action === 'REJECTED' && new Date(l.timestamp).getTime() >= cutoff
    ).length;
  }, [auditLogs]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'APPROVED':
        return <Badge className="bg-success hover:bg-success/80">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'CREATED':
        return <Badge variant="outline">Created</Badge>;
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  if (role !== 'admin') {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-hero rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-white/90 text-lg">You need admin access to view this page.</p>
            </div>
            <Shield className="h-16 w-16 text-white/80" />
          </div>
        </div>
        <div className="text-muted-foreground">Please sign in with an admin account.</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-white/90 text-lg">
              Monitor system performance and manage verification processes
            </p>
          </div>
          <Shield className="h-16 w-16 text-white/80 self-start sm:self-auto" />
        </div>
      </div>

      {err && <div className="text-destructive">{err}</div>}
      {!err && loading && <div className="text-muted-foreground">Loading…</div>}

      {/* Key Metrics (responsive) */}
      {!err && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Total Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof totalUsers === 'number' ? totalUsers.toLocaleString() : '—'}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          {/* Total Verifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verifications (Total)</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof totalRequests === 'number' ? totalRequests.toLocaleString() : '—'}
              </div>
              <p className="text-xs text-muted-foreground">All-time</p>
            </CardContent>
          </Card>

          {/* Pending Reviews (live from /api/dashboard admin branch if added) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Activity className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {typeof pendingReviews === 'number' ? pendingReviews.toLocaleString() : '—'}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting manual review</p>
            </CardContent>
          </Card>

          {/* Fraud / Rejections (derived from audit logs) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fraud / Rejections</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{fraudLast30}</div>
              <p className="text-xs text-muted-foreground">Last 30 days (from audit logs)</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Country Distribution — full width */}
      {!err && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Country Distribution</CardTitle>
            <CardDescription>Users by country (share of total)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {countryRows.length === 0 ? (
              <div className="text-muted-foreground">No data available.</div>
            ) : (
              <div className="space-y-4">
                {countryRows.map((row) => (
                  <div key={row.country} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {row.country === 'IN' ? '🇮🇳 India' :
                         row.country === 'AU' ? '🇦🇺 Australia' :
                         row.country === 'UK' ? '🇬🇧 United Kingdom' :
                         row.country}
                      </span>
                      <span className="text-sm font-bold">{formatPercent(row.percent)}</span>
                    </div>
                    <div className="h-2 w-full rounded bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${Math.max(0, Math.min(100, row.percent))}%` }}
                        aria-label={`${row.country} ${row.percent}%`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Recent system activities and user actions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const rows = [
                    ['timestamp', 'userId', 'action', 'details'],
                    ...auditLogs.map((l) => [
                      new Date(l.timestamp).toISOString(),
                      l.userId,
                      l.action,
                      JSON.stringify(l.details ?? {}),
                    ]),
                  ];
                  const csv = rows
                    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
                    .join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && !err ? (
            <div className="text-muted-foreground py-8">Loading logs…</div>
          ) : auditLogs.length === 0 ? (
            <div className="text-muted-foreground py-8">No audit logs found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono">{log.userId}</TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {JSON.stringify(log.details)}
                        </code>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress ?? '—'}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
