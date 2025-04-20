
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, supabaseSession) => {
        console.log("Auth state change:", event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (supabaseSession) {
            setSession({ access_token: supabaseSession.access_token });
            
            // Use setTimeout to prevent deadlocks with Supabase auth
            setTimeout(async () => {
              try {
                const userData = supabaseSession.user;
                
                if (!userData) return;
                
                // Get user profile
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', userData.id)
                  .single();
                
                // Determine user role
                let role: UserRole = userData.user_metadata?.role || 'student';
                let club_id: string | undefined = undefined;
                
                // Check if user is a club representative
                const { data: clubRep } = await supabase
                  .from('clubs')
                  .select('id')
                  .eq('representative_id', userData.id)
                  .single();
                  
                if (clubRep) {
                  role = 'clubRepresentative';
                  club_id = clubRep.id;
                } else if (userData.email?.endsWith('@cluby.com')) {
                  role = 'admin';
                }
                
                setUser({
                  id: userData.id,
                  email: userData.email || '',
                  role,
                  club_id,
                  profile: profile as Profile
                });
                
                setIsLoading(false);
              } catch (error) {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
              }
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      }
    );
    
    // Check for existing session on load
    const checkAuth = async () => {
      try {
        const { data: { session: supabaseSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }
        
        if (supabaseSession) {
          setSession({ access_token: supabaseSession.access_token });
          
          const userData = supabaseSession.user;
          
          if (userData) {
            // Get user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userData.id)
              .single();
            
            // Determine user role
            let role: UserRole = userData.user_metadata?.role || 'student';
            let club_id: string | undefined = undefined;
            
            // Check if user is a club representative
            const { data: clubRep } = await supabase
              .from('clubs')
              .select('id')
              .eq('representative_id', userData.id)
              .single();
              
            if (clubRep) {
              role = 'clubRepresentative';
              club_id = clubRep.id;
            } else if (userData.email?.endsWith('@cluby.com')) {
              role = 'admin';
            }
            
            setUser({
              id: userData.id,
              email: userData.email || '',
              role,
              club_id,
              profile: profile as Profile
            });
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Refresh user data
  const refreshUser = async () => {
    if (!session?.access_token) return;
    
    try {
      setIsLoading(true);
      const { data: { user: supabaseUser } } = await supabase.auth.getUser(session.access_token);
      
      if (supabaseUser) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();
        
        // Determine user role
        let role: UserRole = supabaseUser.user_metadata?.role || 'student';
        let club_id: string | undefined = undefined;
        
        // Check if user is a club representative
        const { data: clubRep } = await supabase
          .from('clubs')
          .select('id')
          .eq('representative_id', supabaseUser.id)
          .single();
          
        if (clubRep) {
          role = 'clubRepresentative';
          club_id = clubRep.id;
        } else if (supabaseUser.email?.endsWith('@cluby.com')) {
          role = 'admin';
        }
        
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          role,
          club_id,
          profile: profile as Profile
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
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

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
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

  // Register function
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role
          }
        }
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('Registration failed: No user data returned');
      }
      
      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          full_name: name,
          username: email.split('@')[0]
        });
        
      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
      
      // If registering as club representative, create a pending club
      if (role === 'clubRepresentative') {
        const { error: clubError } = await supabase
          .from('clubs')
          .insert({
            name: 'New Club (Please Update)',
            representative_id: data.user.id,
            status: 'pending'
          });
          
        if (clubError) {
          console.error('Error creating club:', clubError);
        }
      }
      
      toast({
        title: "Registration successful",
        description: "Welcome to Cluby! Your account has been created.",
      });
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
