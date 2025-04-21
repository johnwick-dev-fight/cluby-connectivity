
import dbConnect from '../db';
import User from '../models/User';
import Profile from '../models/Profile';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Safe check for browser environment
const isBrowser = typeof window !== 'undefined';

// Secret key for JWT signing - in production, use environment variables
const JWT_SECRET = 'cluby-secure-jwt-secret';

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

export async function registerUser(userData: RegistrationData): Promise<AuthResponse> {
  if (isBrowser) {
    try {
      // Client-side API call to server-side registration endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed',
        error
      };
    }
  } else {
    // Server-side registration logic
    try {
      await dbConnect();
      
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Start a mongoose session for transaction
      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
        // Create user
        const user = await User.create([{
          email: userData.email,
          password: hashedPassword,
          role: userData.role
        }], { session });
        
        // Create profile
        await Profile.create([{
          user_id: user[0]._id,
          full_name: userData.name,
          username: userData.email.split('@')[0]
        }], { session });
        
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        
        // Generate JWT token
        const token = jwt.sign(
          { id: user[0]._id, email: user[0].email, role: user[0].role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        return {
          success: true,
          message: 'User registered successfully',
          user: {
            id: user[0]._id,
            email: user[0].email,
            role: user[0].role
          },
          token
        };
      } catch (error) {
        // Rollback transaction on error
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } catch (error: any) {
      console.error('Server registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed',
        error
      };
    }
  }
}

export async function loginUser(credentials: UserCredentials): Promise<AuthResponse> {
  if (isBrowser) {
    try {
      // Client-side API call to server-side login endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      // Store token in localStorage if login successful
      if (data.success && data.token) {
        localStorage.setItem('cluby_auth_token', data.token);
      }
      
      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed',
        error
      };
    }
  } else {
    // Server-side login logic
    try {
      await dbConnect();
      
      // Find user by email
      const user = await User.findOne({ email: credentials.email });
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }
      
      // Verify password
      const isMatch = await bcrypt.compare(credentials.password, user.password);
      if (!isMatch) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }
      
      // Find user profile
      const profile = await Profile.findOne({ user_id: user._id });
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return {
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile
        },
        token
      };
    } catch (error: any) {
      console.error('Server login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed',
        error
      };
    }
  }
}

export async function getUserByToken(token: string): Promise<AuthResponse> {
  if (isBrowser) {
    try {
      // Client-side API call to server-side verify token endpoint
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Token verification error:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify token',
        error
      };
    }
  } else {
    // Server-side token verification logic
    try {
      if (!token) {
        return {
          success: false,
          message: 'No token provided'
        };
      }
      
      // Verify token
      const decoded: any = jwt.verify(token, JWT_SECRET);
      
      await dbConnect();
      
      // Find user by id
      const user = await User.findById(decoded.id);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }
      
      // Find user profile
      const profile = await Profile.findOne({ user_id: user._id });
      
      return {
        success: true,
        message: 'Token verified successfully',
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile
        }
      };
    } catch (error: any) {
      console.error('Server token verification error:', error);
      return {
        success: false,
        message: error.message || 'Invalid token',
        error
      };
    }
  }
}

export async function logoutUser(): Promise<AuthResponse> {
  if (isBrowser) {
    // Remove token from localStorage
    localStorage.removeItem('cluby_auth_token');
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } else {
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }
}
