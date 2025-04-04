
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import EmailInput from './inputs/EmailInput';
import PasswordInput from './inputs/PasswordInput';
import { toast } from '@/components/ui/use-toast';
import TestAccountsSection from './sections/TestAccountsSection';
import LoginErrorAlert from './sections/LoginErrorAlert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      await login(email, password);
    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError(error.message || "Invalid credentials. Please try again.");
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <CardHeader className="space-y-1 px-6 py-5">
        <CardTitle className="text-xl font-medium">Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pt-2 pb-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showForgotPassword
          />
          
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
          
          <LoginErrorAlert error={loginError} />
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
          
          <div className="text-sm text-center text-muted-foreground mt-2">
            Don't have an account?{' '}
            <Link to="#" onClick={onRegisterClick} className="text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      </CardContent>
      
      <TestAccountsSection />
    </>
  );
};

export default LoginForm;
