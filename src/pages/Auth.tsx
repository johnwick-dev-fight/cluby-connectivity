
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
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [pageLoading, setPageLoading] = useState(true);
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-cluby-700 dark:text-cluby-400 mb-2">Cluby</h1>
        <p className="text-gray-600 dark:text-gray-300">Connect with campus clubs and events</p>
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none bg-gray-100 dark:bg-gray-700 p-0">
              <TabsTrigger value="login" className="py-3 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Login</TabsTrigger>
              <TabsTrigger value="register" className="py-3 rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="m-0">
              <LoginForm onRegisterClick={() => setActiveTab('register')} />
            </TabsContent>
            
            <TabsContent value="register" className="m-0">
              <RegisterForm onLoginClick={() => setActiveTab('login')} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 Cluby. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
