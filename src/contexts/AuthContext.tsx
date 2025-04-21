
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { registerUser, loginUser, getUserByToken, logoutUser } from '@/lib/mongodb/services/authService';

export type UserRole = 'student' | 'clubRepresentative' | 'admin';

export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  department?: string;
  year?: string;
  bio?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  club_id?: string;
  profile?: Profile;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const result = await registerUser({ name, email, password, role });
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setUser(result.user);
      setToken(result.token!);
      localStorage.setItem('cluby_auth_token', result.token!);
      
      toast({
        title: "Registration successful",
        description: "Welcome to Cluby! Your account has been created."
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await loginUser({ email, password });
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setUser(result.user);
      setToken(result.token!);
      localStorage.setItem('cluby_auth_token', result.token!);
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
    } catch (error: any) {
      console.error("Login exception:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      setToken(null);
      localStorage.removeItem('cluby_auth_token');
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('cluby_auth_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await getUserByToken(storedToken);
      
      if (result.success && result.user) {
        setUser(result.user);
        setToken(storedToken);
      } else {
        // Clear invalid token
        localStorage.removeItem('cluby_auth_token');
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      localStorage.removeItem('cluby_auth_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing session on load
  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token,
        isLoading, 
        login, 
        logout, 
        register,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
