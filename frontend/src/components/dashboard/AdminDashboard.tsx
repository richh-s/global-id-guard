import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VerificationRequest, AuditLog } from '@/types/verification';
import { 
  Shield, 
  Users, 
  FileCheck, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Eye,
  Download,
  Filter
} from 'lucide-react';

// Mock data
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: '2',
    action: 'VERIFICATION_APPROVED',
    details: { verificationId: '1', type: 'identity' },
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.1',
  },
  {
    id: '2',
    userId: '2',
    action: 'FRAUD_DETECTED',
    details: { verificationId: '2', riskScore: 0.85 },
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    ipAddress: '192.168.1.2',
  },
  {
    id: '3',
    userId: '1',
    action: 'USER_CREATED',
    details: { email: 'user@example.com' },
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    ipAddress: '192.168.1.3',
  },
];

const mockStats = {
  totalUsers: 1247,
  totalVerifications: 3456,
  pendingReviews: 23,
  fraudDetected: 12,
  successRate: 94.2,
  avgProcessingTime: '2.4 hours',
};

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'VERIFICATION_APPROVED':
        return <Badge className="bg-success hover:bg-success/80">Approved</Badge>;
      case 'FRAUD_DETECTED':
        return <Badge variant="destructive">Fraud Alert</Badge>;
      case 'USER_CREATED':
        return <Badge variant="outline">User Created</Badge>;
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-white/90 text-lg">
              Monitor system performance and manage verification processes
            </p>
          </div>
          <Shield className="h-16 w-16 text-white/80" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verifications</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalVerifications.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Success rate: {mockStats.successRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Activity className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{mockStats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              Avg time: {mockStats.avgProcessingTime}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{mockStats.fraudDetected}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time system status and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Response Time</span>
              <Badge className="bg-success hover:bg-success/80">95ms</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">AI Service Status</span>
              <Badge className="bg-success hover:bg-success/80">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database Status</span>
              <Badge className="bg-success hover:bg-success/80">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Fraud Detection</span>
              <Badge className="bg-success hover:bg-success/80">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Country Distribution</CardTitle>
            <CardDescription>Verification requests by country</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">🇮🇳 India</span>
              <span className="text-sm font-bold">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">🇦🇺 Australia</span>
              <span className="text-sm font-bold">32%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">🇬🇧 United Kingdom</span>
              <span className="text-sm font-bold">23%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Recent system activities and user actions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                  <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};