import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Shield } from 'lucide-react';
import { VerificationRequest, Document } from '@/types/verification'; // Import Document type
import { useToast } from '@/components/ui/use-toast';
import { Header } from '@/components/layout/Header'; // Import Header component

type VerificationType = 'identity' | 'address' | 'employment' | 'business';
type CountryType = 'india' | 'australia' | 'uk';

export const Verify = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verificationType, setVerificationType] = useState<VerificationType | ''>(''); // Use specific type
  const [file, setFile] = useState<File | null>(null);
  const [country, setCountry] = useState<CountryType | ''>(''); // Use specific type
  const [documentType, setDocumentType] = useState<Document['type'] | ''>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationType || !file || !country || !documentType) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields and upload a document.',
      });
      return;
    }

    // Mock API call
    try {
      const mockResponse: VerificationRequest = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user?.id || '',
        type: verificationType,
        status: 'in_review',
        documents: [{
          id: Math.random().toString(36).substr(2, 9),
          type: documentType,
          filename: file.name,
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString(),
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        country: country,
      };

      toast({
        title: 'Success',
        description: 'Verification request submitted successfully!',
      });

      // Reset form
      setVerificationType('');
      setFile(null);
      setCountry('');
      setDocumentType('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit verification request.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="bg-gradient-hero rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">New Verification</h1>
                <p className="text-white/90 text-lg">
                  Upload your documents to verify your identity or address
                </p>
              </div>
              <Shield className="h-16 w-16 text-white/80" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload Verification Documents</CardTitle>
              <CardDescription>
                Select the type of verification and upload the required documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="verificationType">Verification Type</Label>
                  <Select value={verificationType} onValueChange={(value) => setVerificationType(value as VerificationType)}>
                    <SelectTrigger id="verificationType">
                      <SelectValue placeholder="Select verification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="identity">Identity Verification</SelectItem>
                      <SelectItem value="address">Address Verification</SelectItem>
                      <SelectItem value="employment">Employment Verification</SelectItem>
                      <SelectItem value="business">Business Verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select value={documentType} onValueChange={(value) => setDocumentType(value as Document['type'])}>
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="aadhaar">Aadhaar</SelectItem>
                      <SelectItem value="driving_license">Driving License</SelectItem>
                      <SelectItem value="utility_bill">Utility Bill</SelectItem>
                      <SelectItem value="employment_letter">Employment Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={country} onValueChange={(value) => setCountry(value as CountryType)}>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document">Upload Document</Label>
                  <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} border-2 border-dashed rounded-md p-4 text-center cursor-pointer`}>
                    <input {...getInputProps()} id="document" />
                    {isDragActive ? (
                      <p className="text-sm text-muted-foreground">Drop the files here ...</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Drag 'n' drop some files here, or click to select files
                      </p>
                    )}
                  </div>
                  {file && (
                    <p className="text-sm text-muted-foreground">
                      Selected file: {file.name}
                    </p>
                  )}
                </div>

                <Button type="submit" variant="hero" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Verification
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};