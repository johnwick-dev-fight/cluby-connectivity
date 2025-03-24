
import React, { createContext, useState, useContext, useEffect } from 'react';
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

// Mock users for client-side authentication demo
// In a real app, these would be stored in a database
const MOCK_USERS = [
  {
    id: '1',
    email: 'student1@gmail.com',
    password: 'password123',
    role: 'student' as UserRole,
    profile: {
      id: '1',
      full_name: 'Student User',
      avatar_url: '/avatar-placeholder.jpg',
      department: 'Computer Science',
      year: '2nd Year'
    }
  },
  {
    id: '2',
    email: 'club_rep@gmail.com',
    password: 'password123',
    role: 'clubRepresentative' as UserRole,
    profile: {
      id: '2',
      full_name: 'Club Representative',
      avatar_url: '/avatar-placeholder.jpg'
    }
  },
  {
    id: '3',
    email: 'admin@cluby.com',
    password: 'password123',
    role: 'admin' as UserRole,
    profile: {
      id: '3',
      full_name: 'Admin User',
      avatar_url: '/avatar-placeholder.jpg'
    }
  }
];

// Simulate JWT creation without actually using JWT
const generateMockToken = (user: any) => {
  return btoa(JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  }));
};

// Simulate JWT verification without actually using JWT
const verifyMockToken = (token: string) => {
  try {
    const decoded = JSON.parse(atob(token));
    
    // Check if token is expired
    if (decoded.exp < Date.now()) {
      return { data: null, error: new Error('Token expired') };
    }
    
    return { data: decoded, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

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
          const { data, error } = verifyMockToken(token);
          
          if (error || !data) {
            localStorage.removeItem('auth_token');
            setUser(null);
            setSession(null);
          } else {
            // Token is valid, set up user data
            const userData = data as any;
            
            // Find the user in our mock database
            const mockUser = MOCK_USERS.find(u => u.id === userData.id) || MOCK_USERS.find(u => u.email === userData.email);
            
            if (mockUser) {
              setUser({
                id: mockUser.id,
                email: mockUser.email,
                role: mockUser.role,
                profile: mockUser.profile
              });
              
              setSession({ access_token: token });
            } else {
              localStorage.removeItem('auth_token');
            }
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

  // Refresh user data
  const refreshUser = async () => {
    if (!session?.access_token) return;
    
    try {
      const { data } = verifyMockToken(session.access_token);
      if (data) {
        const userData = data as any;
        
        // Find the user in our mock database
        const mockUser = MOCK_USERS.find(u => u.id === userData.id);
        
        if (mockUser) {
          setUser({
            id: mockUser.id,
            email: mockUser.email,
            role: mockUser.role,
            profile: mockUser.profile
          });
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate network request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the user in our mock database
      const user = MOCK_USERS.find(u => u.email === email);
      
      if (!user || user.password !== password) {
        throw new Error('Invalid email or password');
      }
      
      // Generate a mock token
      const token = generateMockToken(user);
      
      // Store the token
      localStorage.setItem('auth_token', token);
      
      setUser({
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile
      });
      
      setSession({ access_token: token });
      
      toast({
        title: "Login successful",
        description: `Welcome back${user.profile?.full_name ? ', ' + user.profile.full_name : ''}!`,
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
      // Simulate network request delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
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

  // Register function (simplified for client-side demo)
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate network request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      if (MOCK_USERS.find(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }
      
      // In a real app, we would call the API to create a user
      // For this demo, we'll simulate a successful registration
      
      // Create a new mock user
      const newUserId = String(MOCK_USERS.length + 1);
      const newUser = {
        id: newUserId,
        email,
        password,
        role,
        profile: {
          id: newUserId,
          full_name: name,
          avatar_url: '/avatar-placeholder.jpg'
        }
      };
      
      // Add to our mock database (this is just for demo)
      // In a real app, the user would be created in a database
      MOCK_USERS.push(newUser);
      
      // Generate a token for the new user
      const token = generateMockToken(newUser);
      
      toast({
        title: "Registration successful",
        description: "Welcome to Cluby! Your account has been created.",
      });
      
      // Store the token
      localStorage.setItem('auth_token', token);
      
      setUser({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile
      });
      
      setSession({ access_token: token });
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
