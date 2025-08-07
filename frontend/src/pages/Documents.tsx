import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Upload } from 'lucide-react'; // Import Upload icon
import { VerificationRequest } from '@/types/verification';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header'; // Import Header component

// Mock data (same as UserDashboard for consistency)
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

export const Documents = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header /> {/* Include the Header component */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="bg-gradient-primary rounded-lg p-6 text-white shadow-xl">
            {/* Hero section with a gradient background */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Documents</h1>
                <p className="text-white/90 text-lg">
                  View and manage all your uploaded verification documents
                </p>
              </div>
              <FileText className="h-16 w-16 text-white/80" />
            </div>
          </div>

          <Card className="shadow-lg">
            {/* Card with a shadow */}
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {mockVerifications.length > 0 ? (
                <div className="space-y-4">
                  {mockVerifications.map((verification) => (
                    <div
                      key={verification.id}
                      className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    >
                      {/* Document item with hover effect */}
                      <div className="space-y-1">
                        <p className="font-medium capitalize">{verification.type} Document</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {verification.documents[0].filename}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Uploaded:{' '}
                          {new Date(verification.documents[0].uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" asChild>
                        <a href={verification.documents[0].url} download>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  {/* Empty state */}
                  <FileText className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No documents uploaded</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                    Upload your first document to start the verification process
                  </p>
                  <Button asChild variant="hero" className="bg-blue-600 hover:bg-blue-700 text-white">
                    {/* Hero button with custom styling */}
                    <Link to="/verify" className="flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};