
import Club from '../models/Club';
import User from '../models/User';
import dbConnect from '../db';
import mongoose from 'mongoose';

export async function getClubs(query = {}) {
  await dbConnect();
  
  try {
    const clubs = await Club.find(query).sort({ created_at: -1 });
    return { data: clubs, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getClubById(id: string) {
  await dbConnect();
  
  try {
    const club = await Club.findById(id);
    return { data: club, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createClub(clubData: any) {
  await dbConnect();
  
  try {
    const newClub = new Club(clubData);
    const savedClub = await newClub.save();
    return { data: savedClub, error: null };
  } catch (error) {
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
    );
    return { data: updatedClub, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getPendingClubs() {
  await dbConnect();
  
  try {
    const pendingClubs = await Club.find({ status: 'pending' });
    return { data: pendingClubs, error: null };
  } catch (error) {
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
    );
    return { data: club, error: null };
  } catch (error) {
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
    );
    return { data: club, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// More club-related functions as needed
