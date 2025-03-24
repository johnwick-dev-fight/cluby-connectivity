
import Club from '../models/Club';
import User from '../models/User';
import dbConnect from '../db';
import mongoose from 'mongoose';

export async function getClubs(query = {}) {
  await dbConnect();
  
  try {
    const clubs = await Club.find(query).sort({ created_at: -1 }).lean();
    
    // Transform MongoDB _id to id for frontend compatibility
    const transformedClubs = clubs.map(club => ({
      ...club,
      id: club._id.toString(),
    }));
    
    return { data: transformedClubs, error: null };
  } catch (error) {
    console.error('Get clubs error:', error);
    return { data: null, error };
  }
}

export async function getClubById(id: string) {
  await dbConnect();
  
  try {
    const club = await Club.findById(id).lean();
    
    if (!club) {
      return { data: null, error: 'Club not found' };
    }
    
    return { 
      data: {
        ...club,
        id: club._id.toString()
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Get club by ID error:', error);
    return { data: null, error };
  }
}

export async function createClub(clubData: any) {
  await dbConnect();
  
  try {
    const newClub = new Club(clubData);
    const savedClub = await newClub.save();
    
    return { 
      data: {
        ...savedClub.toObject(),
        id: savedClub._id.toString()
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Create club error:', error);
    return { data: null, error };
  }
}

export async function updateClub(id: string, clubData: any) {
  await dbConnect();
  
  try {
    const updatedClub = await Club.findByIdAndUpdate(
      id,
      { ...clubData, updated_at: new Date() },
      { new: true }
    ).lean();
    
    if (!updatedClub) {
      return { data: null, error: 'Club not found' };
    }
    
    return { 
      data: {
        ...updatedClub,
        id: updatedClub._id.toString()
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Update club error:', error);
    return { data: null, error };
  }
}

export async function getPendingClubs() {
  await dbConnect();
  
  try {
    const pendingClubs = await Club.find({ status: 'pending' }).lean();
    
    // Transform MongoDB _id to id for frontend compatibility
    const transformedClubs = pendingClubs.map(club => ({
      ...club,
      id: club._id.toString(),
    }));
    
    return { data: transformedClubs, error: null };
  } catch (error) {
    console.error('Get pending clubs error:', error);
    return { data: null, error };
  }
}

export async function approveClub(id: string) {
  await dbConnect();
  
  try {
    const club = await Club.findByIdAndUpdate(
      id,
      { status: 'approved', updated_at: new Date() },
      { new: true }
    ).lean();
    
    if (!club) {
      return { data: null, error: 'Club not found' };
    }
    
    return { 
      data: {
        ...club,
        id: club._id.toString()
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Approve club error:', error);
    return { data: null, error };
  }
}

export async function rejectClub(id: string) {
  await dbConnect();
  
  try {
    const club = await Club.findByIdAndUpdate(
      id,
      { status: 'rejected', updated_at: new Date() },
      { new: true }
    ).lean();
    
    if (!club) {
      return { data: null, error: 'Club not found' };
    }
    
    return { 
      data: {
        ...club,
        id: club._id.toString()
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Reject club error:', error);
    return { data: null, error };
  }
}
