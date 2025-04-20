
import dbConnect from '../db';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

// Safely check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

const JWT_SECRET = isBrowser ? 'fake-secret' : (process.env.JWT_SECRET || 'your-secret-key');

/**
 * Register a new user
 */
export async function registerUser(userData: RegistrationData): Promise<AuthResponse> {
  if (isBrowser) {
    console.warn('Attempted to call registerUser from browser');
    return {
      success: false,
      message: 'Authentication failed: Server-side function called from client'
    };
  }

  try {
    await dbConnect();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      return {
        success: false,
        message: 'Email already registered'
      };
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create new user
    const user = new User({
      email: userData.email,
      password: hashedPassword,
      role: userData.role
    });
    
    await user.save();
    
    // Create profile for the user
    const profile = new Profile({
      user_id: user._id,
      full_name: userData.name,
      username: userData.email.split('@')[0]
    });
    
    await profile.save();
    
    // If registering as club representative, create a pending club
    if (userData.role === 'clubRepresentative') {
      const Club = require('../models/Club').default;
      const club = new Club({
        name: 'New Club (Please Update)',
        representative_id: user._id,
        status: 'pending'
      });
      
      await club.save();
      
      // Associate club with user
      user.club_id = club._id;
      await user.save();
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      token
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Authenticate a user with email and password
 */
export async function loginUser(credentials: UserCredentials): Promise<AuthResponse> {
  if (isBrowser) {
    console.warn('Attempted to call loginUser from browser');
    return {
      success: false,
      message: 'Authentication failed: Server-side function called from client'
    };
  }

  try {
    await dbConnect();
    
    // Find user by email
    const user = await User.findOne({ email: credentials.email }).populate('club_id');
    
    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }
    
    // Check password
    const isMatch = await bcrypt.compare(credentials.password, user.password);
    
    if (!isMatch) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }
    
    // Get user profile
    const profile = await Profile.findOne({ user_id: user._id });
    
    // Generate JWT
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
        club_id: user.club_id ? user.club_id._id : undefined,
        profile: profile
      },
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Login failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get user data by token
 */
export async function getUserByToken(token: string): Promise<AuthResponse> {
  if (isBrowser) {
    console.warn('Attempted to call getUserByToken from browser');
    return {
      success: false,
      message: 'Authentication failed: Server-side function called from client'
    };
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    await dbConnect();
    
    // Find user by id
    const user = await User.findById(decoded.id).populate('club_id');
    
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    // Get user profile
    const profile = await Profile.findOne({ user_id: user._id });
    
    return {
      success: true,
      message: 'User retrieved successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        club_id: user.club_id ? user.club_id._id : undefined,
        profile: profile
      }
    };
  } catch (error) {
    console.error('Get user error:', error);
    return {
      success: false,
      message: 'Failed to get user',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
