import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VerificationStatusCard } from '@/components/verification/VerificationStatusCard';
import { VerificationRequest } from '@/types/verification';
import { 
  Shield, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  FileText,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for inspector
const mockPendingVerifications: VerificationRequest[] = [
  {
    id: '3',
    userId: '4',
    type: 'identity',
    status: 'in_review',
    documents: [
      {
        id: '3',
        type: 'aadhaar',
        filename: 'aadhaar_card.jpg',
        url: '/mock/aadhaar.jpg',
        uploadedAt: new Date().toISOString(),
        fraudCheck: {
          isSuspicious: false,
          tamperedRegions: [],
          riskScore: 0.15,
        }
      }
    ],
    aiAnalysis: {
      confidence: 0.87,
      isValid: true,
      extractedData: { name: 'Rajesh Kumar', id: '1234567890' },
      riskFactors: ['Low image quality'],
      analysisTime: new Date().toISOString(),
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date().toISOString(),
    country: 'india',
  },
  {
    id: '4',
    userId: '5',
    type: 'address',
    status: 'pending',
    documents: [
      {
        id: '4',
        type: 'utility_bill',
        filename: 'electricity_bill.pdf',
        url: '/mock/bill.pdf',
        uploadedAt: new Date().toISOString(),
        fraudCheck: {
          isSuspicious: true,
          tamperedRegions: [
            { x: 100, y: 150, width: 200, height: 50, confidence: 0.92 }
          ],
          riskScore: 0.78,
          fraudType: 'document_tamper'
        }
      }
    ],
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    updatedAt: new Date().toISOString(),
    country: 'australia',
  },
  {
    id: '5',
    userId: '6',
    type: 'employment',
    status: 'in_review',
    documents: [
      {
        id: '5',
        type: 'employment_letter',
        filename: 'employment_verification.pdf',
        url: '/mock/employment.pdf',
        uploadedAt: new Date().toISOString(),
      }
    ],
    aiAnalysis: {
      confidence: 0.91,
      isValid: true,
      extractedData: { company: 'Tech Corp Ltd', position: 'Software Engineer' },
      riskFactors: [],
      analysisTime: new Date().toISOString(),
    },
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    updatedAt: new Date().toISOString(),
    country: 'uk',
  },
];

const mockStats = {
  assigned: 15,
  completed: 143,
  averageTime: '45 minutes',
  accuracyRate: 97.8,
};

export const InspectorDashboard = () => {
  const { user } = useAuth();
  const [pendingVerifications] = useState<VerificationRequest[]>(mockPendingVerifications);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVerifications = pendingVerifications.filter(v => 
    v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: string) => {
    console.log('Approving verification:', id);
    // Implement approval logic
  };

  const handleReject = (id: string) => {
    console.log('Rejecting verification:', id);
    // Implement rejection logic
  };

  const getPriorityBadge = (verification: VerificationRequest) => {
    const fraudCheck = verification.documents[0]?.fraudCheck;
    if (fraudCheck?.isSuspicious) {
      return <Badge variant="destructive">High Priority</Badge>;
    }
    if (verification.aiAnalysis && verification.aiAnalysis.confidence < 0.8) {
      return <Badge className="bg-warning text-warning-foreground hover:bg-warning/80">Medium Priority</Badge>;
    }
    return <Badge variant="outline">Normal</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Inspector Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inspector Dashboard</h1>
            <p className="text-white/90 text-lg">
              Review and verify pending identity documents
            </p>
          </div>
          <Shield className="h-16 w-16 text-white/80" />
        </div>
      </div>

      {/* Inspector Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.assigned}</div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">8</div>
            <p className="text-xs text-muted-foreground">
              Total: {mockStats.completed}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Review Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.averageTime}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              15% faster this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
            <Shield className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{mockStats.accuracyRate}%</div>
            <p className="text-xs text-muted-foreground">
              Quality score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>
                Documents requiring manual inspection and approval
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search verifications..."
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>AI Confidence</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVerifications.map((verification) => (
                <TableRow key={verification.id}>
                  <TableCell className="font-mono">{verification.id}</TableCell>
                  <TableCell className="capitalize">{verification.type}</TableCell>
                  <TableCell className="capitalize">{verification.country}</TableCell>
                  <TableCell>{getPriorityBadge(verification)}</TableCell>
                  <TableCell>
                    {verification.aiAnalysis ? (
                      <span className={`font-semibold ${
                        verification.aiAnalysis.confidence > 0.9 ? 'text-success' :
                        verification.aiAnalysis.confidence > 0.7 ? 'text-warning' :
                        'text-destructive'
                      }`}>
                        {Math.round(verification.aiAnalysis.confidence * 100)}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(verification.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleApprove(verification.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleReject(verification.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* High Priority Cases */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          High Priority Cases
        </h2>
        <div className="grid gap-6">
          {pendingVerifications
            .filter(v => v.documents[0]?.fraudCheck?.isSuspicious)
            .map((verification) => (
              <VerificationStatusCard
                key={verification.id}
                verification={verification}
                showDetails={false}
              />
            ))}
        </div>
      </div>
    </div>
  );
};