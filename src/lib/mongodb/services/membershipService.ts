
import dbConnect from '../db';
import ClubMembership from '../models/ClubMembership';

// Mock data for client-side development
const MOCK_MEMBERSHIPS = [
  {
    id: '1',
    club_id: '1',
    user_id: '3',
    role: 'member',
    join_date: new Date().toISOString(),
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    club: {
      _id: '1',
      name: 'Programming Club',
      logo_url: '/avatar-placeholder.jpg'
    },
    user: {
      _id: '3',
      full_name: 'John Member',
      avatar_url: '/avatar-placeholder.jpg'
    }
  },
  {
    id: '2',
    club_id: '2',
    user_id: '3',
    role: 'member',
    join_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    status: 'active',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    club: {
      _id: '2',
      name: 'Photography Club',
      logo_url: '/avatar-placeholder.jpg'
    },
    user: {
      _id: '3',
      full_name: 'John Member',
      avatar_url: '/avatar-placeholder.jpg'
    }
  }
];

// Check if code is running on server or client
const isServer = typeof window === 'undefined';

export async function requestClubMembership(membershipData: any) {
  try {
    if (isServer) {
      await dbConnect();
      
      // Check if membership already exists
      const existingMembership = await ClubMembership.findOne({
        club_id: membershipData.club_id,
        user_id: membershipData.user_id
      });
      
      if (existingMembership) {
        return { data: null, error: 'You already have a membership status with this club' };
      }
      
      // Create new membership request with pending status
      const newMembership = new ClubMembership({
        ...membershipData,
        status: 'pending',
        role: 'member' // Default role
      });
      
      const savedMembership = await newMembership.save();
      return { data: savedMembership, error: null };
    } else {
      console.log('Mocking club membership request with data:', membershipData);
      return { 
        data: { 
          id: `mock-${Date.now()}`, 
          ...membershipData, 
          status: 'pending',
          role: 'member',
          join_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error requesting club membership:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateMembershipStatus(membershipId: string, status: 'active' | 'inactive' | 'pending') {
  try {
    if (isServer) {
      await dbConnect();
      const updatedMembership = await ClubMembership.findByIdAndUpdate(
        membershipId,
        { 
          status, 
          // If status is being set to active, update the join date
          ...(status === 'active' ? { join_date: new Date() } : {}),
          updated_at: new Date() 
        },
        { new: true }
      );
      
      if (!updatedMembership) {
        return { data: null, error: 'Membership not found' };
      }
      
      return { data: updatedMembership, error: null };
    } else {
      console.log('Mocking membership status update with ID:', membershipId, 'to status:', status);
      return { 
        data: { 
          id: membershipId, 
          status, 
          ...(status === 'active' ? { join_date: new Date().toISOString() } : {}),
          updated_at: new Date().toISOString() 
        }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error updating membership status:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateMemberRole(membershipId: string, role: 'member' | 'coordinator' | 'leader') {
  try {
    if (isServer) {
      await dbConnect();
      const updatedMembership = await ClubMembership.findByIdAndUpdate(
        membershipId,
        { role, updated_at: new Date() },
        { new: true }
      );
      
      if (!updatedMembership) {
        return { data: null, error: 'Membership not found' };
      }
      
      return { data: updatedMembership, error: null };
    } else {
      console.log('Mocking membership role update with ID:', membershipId, 'to role:', role);
      return { 
        data: { id: membershipId, role, updated_at: new Date().toISOString() }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error updating membership role:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getClubMembers(clubId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const members = await ClubMembership.find({ club_id: clubId, status: 'active' })
        .populate('user_id', 'full_name avatar_url email')
        .sort({ join_date: 1 });
        
      return { data: members, error: null };
    } else {
      console.log('Fetching mock members for club ID:', clubId);
      const filteredMembers = MOCK_MEMBERSHIPS.filter(
        membership => membership.club_id === clubId && membership.status === 'active'
      );
      return { data: filteredMembers, error: null };
    }
  } catch (error) {
    console.error('Error fetching club members:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getPendingMembershipRequests(clubId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const pendingRequests = await ClubMembership.find({ club_id: clubId, status: 'pending' })
        .populate('user_id', 'full_name avatar_url email')
        .sort({ created_at: -1 });
        
      return { data: pendingRequests, error: null };
    } else {
      console.log('Fetching mock pending membership requests for club ID:', clubId);
      const filteredRequests = MOCK_MEMBERSHIPS.filter(
        membership => membership.club_id === clubId && membership.status === 'pending'
      );
      return { data: filteredRequests, error: null };
    }
  } catch (error) {
    console.error('Error fetching pending membership requests:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getUserClubMemberships(userId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const memberships = await ClubMembership.find({ user_id: userId })
        .populate('club_id', 'name logo_url description')
        .sort({ join_date: -1 });
        
      return { data: memberships, error: null };
    } else {
      console.log('Fetching mock memberships for user ID:', userId);
      const filteredMemberships = MOCK_MEMBERSHIPS.filter(membership => membership.user_id === userId);
      return { data: filteredMemberships, error: null };
    }
  } catch (error) {
    console.error('Error fetching user club memberships:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getUserActiveClubs(userId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const memberships = await ClubMembership.find({ user_id: userId, status: 'active' })
        .populate('club_id', 'name logo_url description')
        .sort({ join_date: -1 });
        
      return { data: memberships, error: null };
    } else {
      console.log('Fetching mock active clubs for user ID:', userId);
      const filteredMemberships = MOCK_MEMBERSHIPS.filter(
        membership => membership.user_id === userId && membership.status === 'active'
      );
      return { data: filteredMemberships, error: null };
    }
  } catch (error) {
    console.error('Error fetching user active clubs:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function checkUserMembership(clubId: string, userId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const membership = await ClubMembership.findOne({ club_id: clubId, user_id: userId });
      
      return { 
        data: membership ? { 
          exists: true, 
          status: membership.status, 
          role: membership.role,
          id: membership._id 
        } : { exists: false }, 
        error: null 
      };
    } else {
      console.log('Checking mock membership for club ID:', clubId, 'and user ID:', userId);
      const membership = MOCK_MEMBERSHIPS.find(
        m => m.club_id === clubId && m.user_id === userId
      );
      
      return { 
        data: membership ? { 
          exists: true, 
          status: membership.status, 
          role: membership.role,
          id: membership.id 
        } : { exists: false }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error checking user membership:', error);
    return { data: { exists: false }, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
