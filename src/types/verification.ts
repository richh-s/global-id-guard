export interface VerificationRequest {
  id: string;
  userId: string;
  type: 'identity' | 'address' | 'employment' | 'business';
  status: 'pending' | 'in_review' | 'verified' | 'rejected' | 'fraud_detected';
  documents: Document[];
  aiAnalysis?: AIAnalysis;
  inspectorNotes?: string;
  createdAt: string;
  updatedAt: string;
  country: 'india' | 'australia' | 'uk';
}

export interface Document {
  id: string;
  type: 'passport' | 'aadhaar' | 'driving_license' | 'utility_bill' | 'employment_letter';
  filename: string;
  url: string;
  uploadedAt: string;
  fraudCheck?: FraudAnalysis;
}

export interface AIAnalysis {
  confidence: number;
  isValid: boolean;
  extractedData: Record<string, any>;
  riskFactors: string[];
  analysisTime: string;
}

export interface FraudAnalysis {
  isSuspicious: boolean;
  tamperedRegions: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
  }>;
  riskScore: number;
  fraudType?: 'document_tamper' | 'deepfake' | 'duplicate' | 'expired';
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress: string;
}