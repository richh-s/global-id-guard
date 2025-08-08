import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { VerificationRequest } from '@/types/verification';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Shield,
  FileText,
  Eye,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationStatusCardProps {
  verification: VerificationRequest;
  showDetails?: boolean;
  onViewDetails?: () => void;
}

const getStatusIcon = (status: VerificationRequest['status']) => {
  switch (status) {
    case 'verified':
      return <CheckCircle className="h-5 w-5 text-success" />;
    case 'pending':
      return <Clock className="h-5 w-5 text-warning" />;
    case 'in_review':
      return <Eye className="h-5 w-5 text-primary" />;
    case 'rejected':
      return <XCircle className="h-5 w-5 text-destructive" />;
    case 'fraud_detected':
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: VerificationRequest['status']) => {
  const variants = {
    verified: 'default',
    pending: 'secondary',
    in_review: 'outline',
    rejected: 'destructive',
    fraud_detected: 'destructive',
  } as const;

  return (
    <Badge 
      variant={variants[status]} 
      className={cn(
        status === 'verified' && 'bg-success hover:bg-success/80',
        status === 'pending' && 'bg-warning text-warning-foreground hover:bg-warning/80',
        status === 'in_review' && 'border-primary text-primary'
      )}
    >
      {String(status).replace('_', ' ').toUpperCase()}
    </Badge>
  );
};

const getProgressValue = (status: VerificationRequest['status']) => {
  switch (status) {
    case 'pending': return 25;
    case 'in_review': return 50;
    case 'verified': return 100;
    case 'rejected': return 100;
    case 'fraud_detected': return 100;
    default: return 0;
  }
};

export const VerificationStatusCard: React.FC<VerificationStatusCardProps> = ({
  verification,
  showDetails = true,
  onViewDetails,
}) => {
  const statusIcon = getStatusIcon(verification.status);
  const statusBadge = getStatusBadge(verification.status);
  const progressValue = getProgressValue(verification.status);

  // --- NEW: safe locals / fallbacks ---
  const docs = verification.documents ?? [];                 // always an array
  const docCount = docs.length;                              // safe
  const createdAt =
    verification.createdAt ? new Date(verification.createdAt) : new Date();
  const countryLabel = verification.country ?? '—';
  const typeLabel = (verification.type ?? 'identity').toString();

  return (
    <Card className="hover:shadow-medium transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {statusIcon}
            <div>
              <CardTitle className="text-lg capitalize flex items-center gap-2">
                {typeLabel} Verification
                <Shield className="h-4 w-4 text-primary" />
              </CardTitle>
              <CardDescription className="text-sm">
                Submitted {createdAt.toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
          {statusBadge}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {verification.aiAnalysis && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">AI Confidence</span>
              <span className="text-primary font-semibold">
                {Math.round((verification.aiAnalysis.confidence ?? 0) * 100)}%
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>{docCount} document(s)</span>
          </div>
          <div className="capitalize">Country: {countryLabel}</div>
        </div>

        {verification.status === 'fraud_detected' && (
          <div className="bg-destructive-light border border-destructive/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-destructive text-sm font-medium">
              <AlertTriangle className="h-4 w-4" />
              Fraud Detected - Document requires manual review
            </div>
          </div>
        )}

        {showDetails && (
          <div className="flex gap-2 pt-2">
            {onViewDetails && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onViewDetails}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
