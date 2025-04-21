
import User from '../models/User';
import Profile from '../models/Profile';
import mongoose from 'mongoose';

export interface CreateUserData {
  email: string;
  role: 'student' | 'clubRepresentative' | 'admin';
  supabaseId: string;
  name: string;
}

export async function createUser(userData: CreateUserData) {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    console.error('User creation should only be performed server-side');
    throw new Error('Cannot create user in browser environment');
  }

  try {
    // Start a mongoose session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create user
      const user = await User.create([{
        email: userData.email,
        role: userData.role,
        supabaseId: userData.supabaseId
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

      return user[0];
    } catch (error) {
      // Rollback transaction on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error('Error creating user in MongoDB:', error);
    throw error;
  }
}
