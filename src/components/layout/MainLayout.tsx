
import React, { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const MainLayout: React.FC = () => {
  const { user, isLoading, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Refresh user data on mount
  useEffect(() => {
    if (!isLoading && user) {
      refreshUser().catch(error => {
        console.error("Error refreshing user data:", error);
        toast({
          title: "Error",
          description: "Failed to refresh user data. Please try again.",
          variant: "destructive"
        });
      });
    }
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("User not authenticated, redirecting to auth page");
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">
          <div className="cluby-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
