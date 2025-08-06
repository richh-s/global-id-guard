import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle, 
  ArrowRight,
  Users,
  Lock,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import verifyMeLogo from '@/assets/verifyme-logo.png';
import heroBg from '@/assets/hero-bg.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
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
            
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Advanced AI-powered verification platform with multi-country support, 
              fraud detection, and government database integration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild variant="hero" size="xl">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Globe className="h-8 w-8 mb-2 mx-auto" />
                <p className="font-semibold">Multi-Country</p>
                <p className="text-sm opacity-80">India, Australia, UK</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Shield className="h-8 w-8 mb-2 mx-auto" />
                <p className="font-semibold">AI + Manual</p>
                <p className="text-sm opacity-80">Hybrid verification</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Lock className="h-8 w-8 mb-2 mx-auto" />
                <p className="font-semibold">Fraud Detection</p>
                <p className="text-sm opacity-80">Advanced security</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose VerifyMe?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive verification solutions for businesses and individuals worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-medium hover:shadow-strong transition-all duration-300">
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Instant AI Verification</CardTitle>
                <CardDescription>
                  Advanced AI algorithms provide instant document verification with 94%+ accuracy
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-medium hover:shadow-strong transition-all duration-300">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Expert Manual Review</CardTitle>
                <CardDescription>
                  Professional inspectors provide thorough manual verification when needed
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-medium hover:shadow-strong transition-all duration-300">
              <CardHeader>
                <Award className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Government Integration</CardTitle>
                <CardDescription>
                  Direct integration with government databases for authentic verification
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Verified?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust VerifyMe for secure identity verification
          </p>
          <Button asChild variant="glass" size="xl">
            <Link to="/signup">
              Start Your Verification Journey
              <Shield className="ml-2 h-5 w-5" />
            </Link>
          </Button>
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
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link to="/support" className="hover:text-primary transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
