import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Mail, Lock, User, Globe, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import verifyMeLogo from '@/assets/verifyme-logo.png';
import heroBg from '@/assets/hero-bg.jpg';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '' as 'india' | 'australia' | 'uk' | '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasSpecialChar;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!formData.country) {
      setError('Please select a country');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long and contain at least one special character');
      setIsLoading(false);
      return;
    }

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        country: formData.country,
      });

      setShowSuccessModal(true);
    } catch (err: any) {
      const message =
        err.message === 'Email already in use'
          ? 'Email already in use'
          : err.message === 'Invalid signup data'
          ? err.message
          : 'Failed to create account. Please try again.';
      setError(message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-hero/80" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <img src={verifyMeLogo} alt="VerifyMe" className="h-12 w-12" />
              <span className="text-3xl font-bold">VerifyMe</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">
              Join the Future of Identity Verification
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Start your verification journey with our advanced AI-powered platform trusted by businesses worldwide.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <span>Instant AI-powered verification</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <span>Bank-grade security standards</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <span>Global compliance support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src={verifyMeLogo} alt="VerifyMe" className="h-8 w-8" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                VerifyMe
              </span>
            </div>
          </div>

          <Card className="shadow-strong">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>
                Get started with VerifyMe in just a few steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select your country" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="india">🇮🇳 India</SelectItem>
                      <SelectItem value="australia">🇦🇺 Australia</SelectItem>
                      <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  variant="hero"
                  size="lg"
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <Link 
                    to="/login" 
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <Dialog open={showSuccessModal} onOpenChange={handleModalClose}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registration Successful!</DialogTitle>
                <DialogDescription>
                  Your account has been created successfully. You'll be redirected to the login page.
                </DialogDescription>
              </DialogHeader>
              <Button onClick={handleModalClose} className="w-full">
                Continue to Login
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}