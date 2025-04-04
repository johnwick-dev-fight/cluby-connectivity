
// This file provides mock data for client-side development
// In a real application, these functions would be API routes that connect to MongoDB

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

export async function getPendingClubs() {
  const pendingClubs = MOCK_CLUBS.filter(club => club.status === 'pending');
  return { data: pendingClubs, error: null };
}

export async function approveClub(clubId: string) {
  console.log('Approving club with ID:', clubId);
  return { data: { id: clubId, status: 'approved' }, error: null };
}

export async function rejectClub(clubId: string) {
  console.log('Rejecting club with ID:', clubId);
  return { data: { id: clubId, status: 'rejected' }, error: null };
}

export async function createClub(clubData: any) {
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

export async function updateClub(clubId: string, clubData: any) {
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

export async function deleteClub(clubId: string) {
  console.log('Deleting club with ID:', clubId);
  return { data: { id: clubId, deleted: true }, error: null };
}

export async function getClubById(clubId: string) {
  const club = MOCK_CLUBS.find(club => club.id === clubId);
  return { data: club || null, error: club ? null : 'Club not found' };
}

export async function getClubsByUserId(userId: string) {
  const userClubs = MOCK_CLUBS.filter(club => club.representative_id === userId);
  return { data: userClubs, error: null };
}

export async function getAllClubs() {
  return { data: MOCK_CLUBS, error: null };
}
