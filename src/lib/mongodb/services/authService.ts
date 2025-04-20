
import dbConnect from '../db';
import { supabase } from '@/integrations/supabase/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Safe check for browser environment
const isBrowser = typeof window !== 'undefined';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: any;
  token?: string;
  error?: any;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'clubRepresentative' | 'admin';
}

// Hybrid approach - using Supabase for auth but MongoDB for user data
export async function registerUser(userData: RegistrationData): Promise<AuthResponse> {
  if (isBrowser) {
    // Use Supabase client for browser
    try {
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            role: userData.role
          }
        }
      });
      
      if (error) throw error;
      
      // Create profile in Supabase
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: userData.name,
            username: userData.email.split('@')[0]
          });
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
        
        // If registering as club representative, create a pending club
        if (userData.role === 'clubRepresentative') {
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
      }
      
      return {
        success: true,
        message: 'User registered successfully',
        user: data.user
      };
    } catch (error: any) {
      console.error('Supabase registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed',
        error
      };
    }
  } else {
    // Server-side logic would use MongoDB directly
    // This won't be called from the browser
    return {
      success: false,
      message: 'Server-side registration is not implemented in this version',
    };
  }
}

export async function loginUser(credentials: UserCredentials): Promise<AuthResponse> {
  if (isBrowser) {
    // Use Supabase client for browser
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (error) throw error;
      
      return {
        success: true,
        message: 'Login successful',
        user: data.user,
        token: data.session?.access_token
      };
    } catch (error: any) {
      console.error('Supabase login error:', error);
      return {
        success: false,
        message: error.message || 'Invalid credentials',
        error
      };
    }
  } else {
    // Server-side logic would use MongoDB directly
    // This won't be called from the browser
    return {
      success: false,
      message: 'Server-side login is not implemented in this version',
    };
  }
}

export async function getUserByToken(token: string): Promise<AuthResponse> {
  if (isBrowser) {
    // Use Supabase client for browser
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error) throw error;
      
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }
      
      return {
        success: true,
        message: 'User retrieved successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.user_metadata?.role || 'student',
          profile
        }
      };
    } catch (error: any) {
      console.error('Supabase get user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to get user',
        error
      };
    }
  } else {
    // Server-side logic would use MongoDB directly
    // This won't be called from the browser
    return {
      success: false,
      message: 'Server-side user retrieval is not implemented in this version',
    };
  }
}
