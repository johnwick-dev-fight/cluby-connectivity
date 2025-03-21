
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
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
  session: Session | null;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user profile and set user state
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      // Define the default role
      let role: UserRole = 'student';
      
      // Check for admin email first (most reliable method)
      if (supabaseUser.email === 'admin@cluby.com') {
        role = 'admin';
      } 
      // Then check user metadata
      else if (supabaseUser.user_metadata?.role === 'admin') {
        role = 'admin';
      } else if (supabaseUser.user_metadata?.role === 'clubRepresentative') {
        role = 'clubRepresentative';
      } else {
        // Fallback check for club representatives
        const { data: clubRep } = await supabase
          .from('clubs')
          .select('representative_id')
          .eq('representative_id', supabaseUser.id)
          .single();
          
        if (clubRep) {
          role = 'clubRepresentative';
        }
      }
      
      // Get user profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        role,
        profile: profile || undefined
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userData = await fetchUserProfile(session.user);
        setUser(userData);
        setSession(session);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  // Initial session check
  useEffect(() => {
    setIsLoading(true);
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        const userData = await fetchUserProfile(session.user);
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });
    
    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        const userData = await fetchUserProfile(session.user);
        setUser(userData);
      }
      
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userData = await fetchUserProfile(data.user);
        setUser(userData);
        setSession(data.session);
        toast({
          title: "Login successful",
          description: `Welcome back${userData?.profile?.full_name ? ', ' + userData.profile.full_name : ''}!`,
        });
      }
    } catch (error: any) {
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
      await supabase.auth.signOut();
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
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Welcome to Cluby! Your account has been created.",
      });
      
      if (data.user) {
        // Create profile manually if trigger doesn't work
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: data.user.id, 
            full_name: name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
        
        const userData = await fetchUserProfile(data.user);
        setUser(userData);
        setSession(data.session);
      }
    } catch (error: any) {
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
