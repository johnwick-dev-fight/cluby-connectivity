
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Loader2 } from 'lucide-react';

// Import smaller component pieces
import EmailInput from './inputs/EmailInput';
import PasswordInput from './inputs/PasswordInput';
import TestAccountsSection from './sections/TestAccountsSection';
import LoginErrorAlert from './sections/LoginErrorAlert';

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError("Please enter both email and password");
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Attempting login with:", email);
      await login(email, password);
      console.log("Login successful, redirecting...");
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to login";
      setError(errorMessage);
      
      // Show more helpful message if it's authentication related
      if (errorMessage.includes("Invalid login credentials") || errorMessage.includes("Invalid email or password")) {
        toast({
          title: "Login Failed",
          description: "The email or password you entered is incorrect. Please try again or register for a new account.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full shadow-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold dark:text-white">Sign in</CardTitle>
        <CardDescription className="dark:text-gray-400">Enter your credentials to access your account</CardDescription>
        <LoginErrorAlert error={error} />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <EmailInput value={email} onChange={setEmail} />
          
          <PasswordInput 
            id="password" 
            label="Password" 
            value={password} 
            onChange={setPassword} 
            showForgotPassword={true} 
          />
          
          <Button type="submit" className="w-full group" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                Sign in <LogIn className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </Button>
          
          <TestAccountsSection />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={onRegisterClick} className="dark:text-gray-300">
          Don't have an account? Sign up
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
