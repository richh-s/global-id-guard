import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import {
  Shield,
  Zap,
  Globe,
  Users,
  Lock,
  Award,
  FileCheck,
  Eye,
  Activity,
  BarChart2,
  Fingerprint,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import verifyMeLogo from '@/assets/verifyme-logo.png';
import heroBg from '@/assets/hero-bg.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-hero/90" />
        <div className="relative z-10 container text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <img src={verifyMeLogo} alt="VerifyMe" className="h-16 w-16 animate-float" />
              <span className="text-5xl font-bold">VerifyMe</span>
            </div>

            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Global Identity & Trust
              <span className="block bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 mt-4">
                Verification Framework
              </span>
            </h1>

            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              KYC/KYB verification with AI fraud checks and a human-in-the-loop review flow. Multi-country support,
              inspector tools with document preview, and admin analytics with audit trails.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild variant="hero" size="xl">
                <Link to="/signup">Get Started Free</Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Globe className="h-8 w-8 mb-2 mx-auto" />
                <p className="font-semibold">Multi-Country</p>
                <p className="text-sm opacity-80">India · Australia · UK</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Shield className="h-8 w-8 mb-2 mx-auto" />
                <p className="font-semibold">AI + Manual</p>
                <p className="text-sm opacity-80">Hybrid verification</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Fingerprint className="h-8 w-8 mb-2 mx-auto" />
                <p className="font-semibold">Fraud Checks</p>
                <p className="text-sm opacity-80">Tampering & deepfake signals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What You Can Verify</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Out-of-the-box support for common KYC/KYB flows and documents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-medium hover:shadow-strong transition-all">
              <CardHeader>
                <FileCheck className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Identity</CardTitle>
                <CardDescription>Passports & driving licenses</CardDescription>
              </CardHeader>
            </Card>
            <Card className="shadow-medium hover:shadow-strong transition-all">
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Address</CardTitle>
                <CardDescription>Utility bills & bank letters</CardDescription>
              </CardHeader>
            </Card>
            <Card className="shadow-medium hover:shadow-strong transition-all">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Employment</CardTitle>
                <CardDescription>Employment letters & proofs</CardDescription>
              </CardHeader>
            </Card>
            <Card className="shadow-medium hover:shadow-strong transition-all">
              <CardHeader>
                <Award className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Business</CardTitle>
                <CardDescription>KYB document checks</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Platform Features</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to run a reliable verification pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-medium hover:shadow-strong transition-all">
              <CardHeader>
                <Fingerprint className="h-10 w-10 text-primary mb-3" />
                <CardTitle>AI Fraud Detection</CardTitle>
                <CardDescription>
                  Tampering & deepfake signals with confidence scores. Viewable per request.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-all">
              <CardHeader>
                <Eye className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Inspector Console</CardTitle>
                <CardDescription>
                  Preview images/PDFs, approve or reject with reasons, instant list refresh.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-all">
              <CardHeader>
                <BarChart2 className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Admin Analytics</CardTitle>
                <CardDescription>
                  Totals, country distribution, and recent activity at a glance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-all">
              <CardHeader>
                <Activity className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>
                  Every decision captured with who/when/why for compliance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-all">
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Real‑Time Status</CardTitle>
                <CardDescription>
                  User dashboard with live counts and rejection reasons surfaced.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-all">
              <CardHeader>
                <Lock className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Role‑Based Access</CardTitle>
                <CardDescription>
                  JWT auth with roles: user, inspector, admin. Secure routes per role.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-all">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Hybrid Review</CardTitle>
                <CardDescription>
                  AI scoring plus human adjudication for high confidence & safety.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-all">
              <CardHeader>
                <Globe className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Multi‑Country</CardTitle>
                <CardDescription>
                  Country‑aware flows and metrics (IN, AU, UK out of the box).
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src={verifyMeLogo} alt="VerifyMe" className="h-8 w-8" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                VerifyMe
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
