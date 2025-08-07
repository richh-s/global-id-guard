import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Header } from '@/components/layout/Header';
import verifyMeLogo from '@/assets/verifyme-logo.png';

export const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      // Mock API call to update profile
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile.',
      });
    }
  };

  const handleCancelClick = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section className="relative rounded-lg p-8 text-white bg-gradient-primary shadow-medium mb-8">
          <div className="flex items-center justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <img src={verifyMeLogo} alt="VerifyMe" className="h-12 w-12 animate-float" />
                <h1 className="text-4xl font-bold text-white">Profile Settings</h1>
              </div>
              <p className="text-lg opacity-90">
                Manage your account information and personalize your settings
              </p>
            </div>
            <Shield className="h-16 w-16 text-white/80" />
          </div>
        </section>

        <Card className="shadow-medium hover:shadow-strong transition-all duration-300 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className="border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary cursor-text"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className="border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary cursor-text"
                />
              </div>

              {!isEditing ? (
                <Button
                  onClick={handleEditClick}
                  className="bg-gradient-primary text-white hover:bg-gradient-primary/80"
                >
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-4">
                  <Button
                    onClick={handleSaveClick}
                    variant="hero"
                    className="bg-gradient-primary text-white hover:bg-gradient-primary/80"
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelClick}
                    className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};