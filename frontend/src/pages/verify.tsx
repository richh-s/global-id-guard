// src/pages/verify/Verify.tsx
import { useState, useCallback } from 'react'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Shield } from 'lucide-react'
import type { VerificationRequest, Document } from '@/types/verification'
import { useToast } from '@/components/ui/use-toast'
import { Header } from '@/components/layout/Header'

type VerificationType = 'identity' | 'address' | 'employment' | 'business'
type CountryCode = 'IN' | 'AU' | 'UK'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export const Verify = () => {
  const { user } = useAuth()
  const { toast } = useToast()

  const [verificationType, setVerificationType] = useState<VerificationType | ''>('')
  const [file, setFile] = useState<File | null>(null)
  const [country, setCountry] = useState<CountryCode | ''>('') // <-- ISO-2 codes
  const [documentType, setDocumentType] = useState<Document['type'] | ''>('')
  const [submitting, setSubmitting] = useState(false)

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted?.[0]) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationType || !file || !country || !documentType) {
      toast({
        variant: 'destructive',
        title: 'Missing info',
        description: 'Pick verification type, document type, country and a file.',
      })
      return
    }

    try {
      setSubmitting(true)
      const token = localStorage.getItem('verifyme_token') || ''

      let res
      if (verificationType === 'address') {
        // Address → /api/address-verify (expects "photo")
        const fd = new FormData()
        fd.append('photo', file)
        fd.append('country', country)            // <-- already ISO-2
        fd.append('documentType', documentType)  // harmless if backend ignores for address
        res = await axios.post(`${API_BASE}/api/address-verify`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        // Identity/Employment/Business → /api/verify (expects "file" + verificationType)
        const fd = new FormData()
        fd.append('file', file)
        fd.append('country', country)            // <-- already ISO-2
        fd.append('documentType', documentType)
        fd.append('verificationType', verificationType)
        res = await axios.post(`${API_BASE}/api/verify`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }

      const created: Partial<VerificationRequest> = res.data
      toast({
        title: 'Submitted!',
        description: created?.id ? `Request #${created.id} created.` : 'Verification request submitted.',
      })

      // reset
      setVerificationType('')
      setCountry('')
      setDocumentType('')
      setFile(null)
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'Failed to submit verification request.'
      toast({ variant: 'destructive', title: 'Error', description: message })
    } finally {
      setSubmitting(false)
    }
  }

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
                  <Select
                    value={verificationType}
                    onValueChange={(v) => setVerificationType(v as VerificationType)}
                  >
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
                  <Select
                    value={documentType}
                    onValueChange={(v) => setDocumentType(v as Document['type'])}
                  >
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      {/* Aadhaar removed */}
                      <SelectItem value="driving_license">Driving License</SelectItem>
                      <SelectItem value="utility_bill">Utility Bill</SelectItem>
                      <SelectItem value="employment_letter">Employment Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={country} onValueChange={(v) => setCountry(v as CountryCode)}>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="IN">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document">Upload Document</Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
                      isDragActive ? 'border-primary/70' : 'border-muted'
                    }`}
                  >
                    <input {...getInputProps()} id="document" />
                    {isDragActive ? (
                      <p className="text-sm text-muted-foreground">Drop the file here…</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Drag & drop a file here, or click to select
                      </p>
                    )}
                  </div>
                  {file && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected file: <span className="font-medium">{file.name}</span>
                    </p>
                  )}
                </div>

                <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
                  <Upload className="h-4 w-4 mr-2" />
                  {submitting ? 'Submitting…' : 'Submit Verification'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Verify
