
import React, { createContext, useState, useContext, useEffect } from 'react';
import { signIn, signUp, signOut, verifyToken, getUserProfile } from '@/lib/mongodb/services/userService';
import { toast } from '@/components/ui/use-toast';

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
  profile?: Profile;
}

interface AuthContextType {
  user: User | null;
  session: { access_token: string } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          const { data, error } = await verifyToken(token);
          
          if (error || !data) {
            localStorage.removeItem('auth_token');
            setUser(null);
            setSession(null);
          } else {
            // Token is valid, set up user data
            const userData = data as any;
            const profile = await getUserProfile(userData.id);
            
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              profile: profile || undefined
            });
            
            setSession({ access_token: token });
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('auth_token');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!session?.access_token) return;
    
    try {
      const { data } = await verifyToken(session.access_token);
      if (data) {
        const userData = data as any;
        const profile = await getUserProfile(userData.id);
        
        setUser({
          id: userData.id,
          email: userData.email,
          role: userData.role,
          profile: profile || undefined
        });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: authUser, session: authSession, error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      if (authUser && authSession) {
        // Store the token
        localStorage.setItem('auth_token', authSession.access_token);
        
        // Fetch user profile
        const profile = await fetchUserProfile(authUser.id);
        
        setUser({
          id: authUser.id,
          email: authUser.email,
          role: authUser.role,
          profile: profile || undefined
        });
        
        setSession(authSession);
        
        toast({
          title: "Login successful",
          description: `Welcome back${profile?.full_name ? ', ' + profile.full_name : ''}!`,
        });
      }
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

  // Logout function
  const logout = async () => {
    try {
      await signOut();
      localStorage.removeItem('auth_token');
      setUser(null);
      setSession(null);
      
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
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const { user: authUser, session: authSession, error } = await signUp(email, password, {
        full_name: name,
        role: role,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration successful",
        description: "Welcome to Cluby! Your account has been created.",
      });
      
      if (authUser && authSession) {
        // Store the token
        localStorage.setItem('auth_token', authSession.access_token);
        
        // Fetch user profile
        const profile = await fetchUserProfile(authUser.id);
        
        setUser({
          id: authUser.id,
          email: authUser.email,
          role: authUser.role,
          profile: profile || undefined
        });
        
        setSession(authSession);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session,
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
