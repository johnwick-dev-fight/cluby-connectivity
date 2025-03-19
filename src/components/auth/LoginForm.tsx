
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, LogIn, Facebook, Github, Google, Twitter, Loader2, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");
  
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

  // Simulated social login
  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Social Login",
      description: `${provider} login is not implemented in this demo`,
    });
  };
  
  return (
    <Card className="w-full shadow-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold dark:text-white">Sign in</CardTitle>
        <CardDescription className="dark:text-gray-400">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <ToggleGroup type="single" value={loginMethod} onValueChange={(value) => value && setLoginMethod(value)} className="justify-center mb-6">
          <ToggleGroupItem value="email" aria-label="Email login">Email</ToggleGroupItem>
          <ToggleGroupItem value="phone" aria-label="Phone login">Phone</ToggleGroupItem>
        </ToggleGroup>

        {loginMethod === "email" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="dark:text-gray-300">Password</Label>
                <Button variant="link" size="sm" className="px-0 text-cluby-600 dark:text-cluby-400">
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <Button type="submit" className="w-full group" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in <LogIn className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="dark:text-gray-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Button type="button" className="w-full" variant="secondary">
              Send OTP <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t dark:border-gray-700"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground dark:bg-gray-800 dark:text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <Google className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              className="dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => handleSocialLogin('Twitter')}
              className="dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => handleSocialLogin('Github')}
              className="dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <Github className="h-4 w-4" />
            </Button>
          </div>

          <Separator className="my-4 dark:bg-gray-700" />

          <div className="mt-4 grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleQuickLogin('student@example.com')}
              className="dark:border-gray-700 dark:hover:bg-gray-700"
              animation="pulse"
            >
              Login as Student
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleQuickLogin('clubrep@example.com')}
              className="dark:border-gray-700 dark:hover:bg-gray-700"
              animation="pulse"
            >
              Login as Club Representative
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => handleQuickLogin('admin@example.com')}
              className="dark:border-gray-700 dark:hover:bg-gray-700"
              animation="pulse"
            >
              Login as Admin
            </Button>
          </div>
        </div>
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
