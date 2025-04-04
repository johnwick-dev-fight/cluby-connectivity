
import { ObjectId } from 'mongodb';
import dbConnect from '../db';
import Club from '../models/Club';

// Mock data for client-side development
const MOCK_CLUBS = [
  {
    id: '1',
    name: 'Programming Club',
    logo_url: '/avatar-placeholder.jpg',
    description: 'A club for programming enthusiasts',
    objectives: 'Learning and sharing programming knowledge',
    representative_id: '1',
    status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Photography Club',
    logo_url: '/avatar-placeholder.jpg',
    description: 'A club for photography enthusiasts',
    objectives: 'Capturing moments and sharing techniques',
    representative_id: '2',
    status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Debate Club',
    logo_url: '/avatar-placeholder.jpg',
    description: 'A club for debating current issues',
    objectives: 'Enhancing communication and critical thinking',
    representative_id: '3',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Check if code is running on server or client
const isServer = typeof window === 'undefined';

export async function getPendingClubs() {
  try {
    if (isServer) {
      await dbConnect();
      const pendingClubs = await Club.find({ status: 'pending' })
        .populate('representative_id', 'email');
      return { data: pendingClubs, error: null };
    } else {
      const pendingClubs = MOCK_CLUBS.filter(club => club.status === 'pending');
      return { data: pendingClubs, error: null };
    }
  } catch (error) {
    console.error('Error fetching pending clubs:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function approveClub(clubId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const club = await Club.findByIdAndUpdate(
        clubId,
        { status: 'approved', updated_at: new Date() },
        { new: true }
      );
      
      if (!club) {
        return { data: null, error: 'Club not found' };
      }
      
      return { data: club, error: null };
    } else {
      console.log('Approving club with ID:', clubId);
      return { data: { id: clubId, status: 'approved' }, error: null };
    }
  } catch (error) {
    console.error('Error approving club:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function rejectClub(clubId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const club = await Club.findByIdAndUpdate(
        clubId,
        { status: 'rejected', updated_at: new Date() },
        { new: true }
      );
      
      if (!club) {
        return { data: null, error: 'Club not found' };
      }
      
      return { data: club, error: null };
    } else {
      console.log('Rejecting club with ID:', clubId);
      return { data: { id: clubId, status: 'rejected' }, error: null };
    }
  } catch (error) {
    console.error('Error rejecting club:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createClub(clubData: any) {
  try {
    if (isServer) {
      await dbConnect();
      const newClub = new Club({
        ...clubData,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      });
      
      const savedClub = await newClub.save();
      return { data: savedClub, error: null };
    } else {
      console.log('Creating club with data:', clubData);
      return { 
        data: { 
          id: `mock-${Date.now()}`, 
          ...clubData, 
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error creating club:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateClub(clubId: string, clubData: any) {
  try {
    if (isServer) {
      await dbConnect();
      const updatedClub = await Club.findByIdAndUpdate(
        clubId,
        { ...clubData, updated_at: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!updatedClub) {
        return { data: null, error: 'Club not found' };
      }
      
      return { data: updatedClub, error: null };
    } else {
      console.log('Updating club with ID:', clubId, 'and data:', clubData);
      return { 
        data: { 
          id: clubId, 
          ...clubData, 
          updated_at: new Date().toISOString() 
        }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error updating club:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteClub(clubId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const deletedClub = await Club.findByIdAndDelete(clubId);
      
      if (!deletedClub) {
        return { data: null, error: 'Club not found' };
      }
      
      return { data: { id: clubId, deleted: true }, error: null };
    } else {
      console.log('Deleting club with ID:', clubId);
      return { data: { id: clubId, deleted: true }, error: null };
    }
  } catch (error) {
    console.error('Error deleting club:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getClubById(clubId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const club = await Club.findById(clubId)
        .populate('representative_id', 'email');
        
      if (!club) {
        return { data: null, error: 'Club not found' };
      }
      
      return { data: club, error: null };
    } else {
      const club = MOCK_CLUBS.find(club => club.id === clubId);
      return { data: club || null, error: club ? null : 'Club not found' };
    }
  } catch (error) {
    console.error('Error fetching club:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getClubsByUserId(userId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const clubs = await Club.find({ representative_id: userId });
      return { data: clubs, error: null };
    } else {
      const userClubs = MOCK_CLUBS.filter(club => club.representative_id === userId);
      return { data: userClubs, error: null };
    }
  } catch (error) {
    console.error('Error fetching clubs by user ID:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getAllClubs() {
  try {
    if (isServer) {
      await dbConnect();
      const clubs = await Club.find({ status: 'approved' })
        .sort({ name: 1 });
      return { data: clubs, error: null };
    } else {
      const approvedClubs = MOCK_CLUBS.filter(club => club.status === 'approved');
      return { data: approvedClubs, error: null };
    }
  } catch (error) {
    console.error('Error fetching all clubs:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
