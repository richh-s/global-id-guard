import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { InspectorDashboard } from '@/components/dashboard/InspectorDashboard';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { Header } from '@/components/layout/Header';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'inspector':
        return <InspectorDashboard />;
      case 'user':
        return <UserDashboard />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {renderDashboard()}
      </main>
    </div>
  );
}