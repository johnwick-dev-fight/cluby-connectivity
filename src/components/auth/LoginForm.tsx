
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock } from 'lucide-react';

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Quick login buttons for demo
  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password'); // In a real app, you'd never do this
    
    try {
      await login(demoEmail, 'password');
      toast({
        title: "Demo Login",
        description: `Logged in as ${demoEmail}`,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full shadow-lg border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm text-cluby-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">Demo Logins</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleQuickLogin('student@example.com')}
            >
              Login as Student
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleQuickLogin('clubrep@example.com')}
            >
              Login as Club Representative
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleQuickLogin('admin@example.com')}
            >
              Login as Admin
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={onRegisterClick}>
          Don't have an account? Sign up
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
