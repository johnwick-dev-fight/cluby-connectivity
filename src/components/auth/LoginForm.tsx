
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, InfoIcon, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  
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
  
  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  const handleTestAccountClick = () => {
    setShowTestAccounts(!showTestAccounts);
  };
  
  return (
    <Card className="w-full shadow-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold dark:text-white">Sign in</CardTitle>
        <CardDescription className="dark:text-gray-400">Enter your credentials to access your account</CardDescription>
        {error && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
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
                autoComplete="email"
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
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={toggleShowPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
          </div>
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
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card dark:bg-gray-800 px-2 text-muted-foreground">
                Test Accounts
              </span>
            </div>
          </div>
          
          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            <button
              type="button"
              onClick={handleTestAccountClick}
              className="inline-flex items-center text-primary hover:underline focus:outline-none"
            >
              {showTestAccounts ? "Hide test accounts" : "Show test accounts"}
              <InfoIcon className="ml-1 h-3.5 w-3.5" />
            </button>
            
            {showTestAccounts && (
              <div className="mt-2 bg-muted p-3 rounded-md text-left">
                <p className="mb-1 font-medium">For testing purposes, use:</p>
                <p>Student: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">student1@gmail.com</span> / <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">password123</span></p>
                <p>Club Rep: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">club_rep@gmail.com</span> / <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">password123</span></p>
                <p>Admin: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">admin@cluby.com</span> / <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">password123</span></p>
                <p className="mt-2 text-xs">To create a new account, please use the Register form.</p>
              </div>
            )}
          </div>
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
