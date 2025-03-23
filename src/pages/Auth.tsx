
import React, { useEffect } from 'react';
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
  const [activeTab, setActiveTab] = React.useState('login');
  
  console.log("Auth component rendering with user:", user?.email, "loading:", isLoading, "session:", session?.user?.email);
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
