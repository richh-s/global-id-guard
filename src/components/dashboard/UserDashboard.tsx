import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VerificationStatusCard } from '@/components/verification/VerificationStatusCard';
import { VerificationRequest } from '@/types/verification';
import { 
  Plus, 
  Shield, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const mockVerifications: VerificationRequest[] = [
  {
    id: '1',
    userId: '3',
    type: 'identity',
    status: 'verified',
    documents: [
      {
        id: '1',
        type: 'passport',
        filename: 'passport.jpg',
        url: '/mock/passport.jpg',
        uploadedAt: new Date().toISOString(),
      }
    ],
    aiAnalysis: {
      confidence: 0.94,
      isValid: true,
      extractedData: { name: 'Jane User', id: 'ABC123456' },
      riskFactors: [],
      analysisTime: new Date().toISOString(),
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    country: 'uk',
  },
  {
    id: '2',
    userId: '3',
    type: 'address',
    status: 'in_review',
    documents: [
      {
        id: '2',
        type: 'utility_bill',
        filename: 'utility_bill.pdf',
        url: '/mock/utility_bill.pdf',
        uploadedAt: new Date().toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
    country: 'uk',
  },
];

export const UserDashboard = () => {
  const { user } = useAuth();
  const [verifications] = useState<VerificationRequest[]>(mockVerifications);

  const stats = {
    total: verifications.length,
    verified: verifications.filter(v => v.status === 'verified').length,
    pending: verifications.filter(v => v.status === 'pending' || v.status === 'in_review').length,
    rejected: verifications.filter(v => v.status === 'rejected').length,
  };

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">
              Successfully verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              Require resubmission
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Start a new verification or manage existing ones
          </CardDescription>
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

        {verifications.length > 0 ? (
          <div className="grid gap-6">
            {verifications.map((verification) => (
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
  );
};