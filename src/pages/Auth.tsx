
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const { user, isLoading, session } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [pageLoading, setPageLoading] = useState(true);
  
  console.log("Auth component rendering with user:", user?.email, "loading:", isLoading, "session:", session?.user?.email);
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for auth status to be determined
        if (!isLoading) {
          console.log("Auth status determined, user:", user?.email);
          if (user) {
            console.log("User is authenticated, redirecting to dashboard");
            navigate('/dashboard');
          }
          setPageLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setPageLoading(false);
        toast({
          title: "Authentication Error",
          description: "There was a problem verifying your authentication status. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    checkAuth();
  }, [user, isLoading, navigate]);

  if (isLoading || pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 dark:bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onRegisterClick={() => setActiveTab('register')} />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm onLoginClick={() => setActiveTab('login')} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
