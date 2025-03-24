
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import EmailInput from './inputs/EmailInput';
import PasswordInput from './inputs/PasswordInput';
import { toast } from '@/components/ui/use-toast';
import TestAccountsSection from './sections/TestAccountsSection';
import LoginErrorAlert from './sections/LoginErrorAlert';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <EmailInput
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <PasswordInput
              id="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <LoginErrorAlert error={loginError} />
          <CardFooter>
            <Button disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </CardFooter>
        </form>
      </CardContent>
      <div className="px-6 pb-4 text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="#" onClick={onRegisterClick} className="text-primary hover:underline">
          Register
        </Link>
      </div>
      <TestAccountsSection />
    </Card>
  );
};

export default LoginForm;
