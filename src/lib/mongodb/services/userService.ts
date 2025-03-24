
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Profile from '../models/Profile';
import dbConnect from '../db';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthResponse {
  user: any;
  session: {
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
  } | null;
  error?: Error;
}

export async function signUp(email: string, password: string, userData: any): Promise<AuthResponse> {
  await dbConnect();
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const newUser = new User({
      email,
      password: hashedPassword,
      role: userData.role || 'student'
    });
    
    const savedUser = await newUser.save();
    
    // Create profile
    const newProfile = new Profile({
      user_id: savedUser._id,
      full_name: userData.full_name || '',
      // Add other profile fields as needed
    });
    
    await newProfile.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      user: {
        id: savedUser._id.toString(),
        email: savedUser.email,
        role: savedUser.role
      },
      session: {
        access_token: token
      }
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      user: null,
      session: null,
      error: error as Error
    };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  await dbConnect();
  
  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id.toString(),
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      },
      session: {
        access_token: token
      }
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      user: null,
      session: null,
      error: error as Error
    };
  }
}

export async function getUserProfile(userId: string) {
  await dbConnect();
  
  try {
    const profile = await Profile.findOne({ user_id: new mongoose.Types.ObjectId(userId) });
    return profile;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { data: decoded, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function signOut() {
  // With JWT, you don't need to do anything server-side
  // The client just needs to remove the token
  return { error: null };
}
