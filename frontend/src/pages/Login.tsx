import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from '@/hooks/use-toast';
import verifyMeLogo from '@/assets/verifyme-logo.png';
import heroBg from '@/assets/hero-bg.jpg';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await login({ email: values.email, password: values.password });
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate('/dashboard');
      } catch (err: any) {
        const message =
          err.message === 'Invalid email or password'
            ? 'Invalid email or password'
            : 'Login failed. Please try again.';
        setStatus({ error: message });
        setSubmitting(false);
      }
    },
  });

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    formik.setValues({ email: demoEmail, password: demoPassword });
    formik.handleSubmit();
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
              Secure Identity Verification Platform
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Advanced AI-powered verification with global compliance and fraud detection capabilities.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <span>Multi-country support (India, Australia, UK)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <span>AI + Manual verification hybrid</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <span>Advanced fraud detection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
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
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your VerifyMe account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                {formik.status?.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{formik.status.error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...formik.getFieldProps('email')}
                      className={`pl-10 ${formik.touched.email && formik.errors.email ? 'border-destructive' : ''}`}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-sm text-destructive">{formik.errors.email}</div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...formik.getFieldProps('password')}
                      className={`pl-10 pr-10 ${formik.touched.password && formik.errors.password ? 'border-destructive' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-sm text-destructive">{formik.errors.password}</div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={formik.isSubmitting}
                  variant="hero"
                  size="lg"
                >
                  {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={formik.isSubmitting}
                    onClick={() => handleDemoLogin('admin@verifyme.com', 'password')}
                  >
                    Admin Demo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={formik.isSubmitting}
                    onClick={() => handleDemoLogin('inspector@verifyme.com', 'password')}
                  >
                    Inspector Demo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={formik.isSubmitting}
                    onClick={() => handleDemoLogin('user@verifyme.com', 'password')}
                  >
                    User Demo
                  </Button>
                </div>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link 
                    to="/signup" 
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}