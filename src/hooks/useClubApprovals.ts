
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface Club {
  id: string;
  name: string;
  representative_id: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Mock data for client-side demo
const MOCK_PENDING_CLUBS: Club[] = [
  {
    id: '1',
    name: 'Coding Club',
    representative_id: '2',
    description: 'A club for coding enthusiasts',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Photography Club',
    representative_id: '2',
    description: 'Capture memories through lenses',
    status: 'pending'
  },
  {
    id: '3',
    name: 'Debate Club',
    representative_id: '2',
    description: 'Enhance your public speaking skills',
    status: 'pending'
  }
];

export const useClubApprovals = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPendingClubs = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setClubs(MOCK_PENDING_CLUBS);
    } catch (error) {
      console.error('Error fetching pending clubs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pending club requests.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approveClubAction = useCallback(async (clubId: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local clubs state
      setClubs(prevClubs => prevClubs.filter(club => club.id !== clubId));
      
      toast({
        title: 'Club Approved',
        description: 'The club has been approved successfully.',
      });
    } catch (error) {
      console.error('Error approving club:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve the club.',
        variant: 'destructive',
      });
    }
  }, []);

  const rejectClubAction = useCallback(async (clubId: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local clubs state
      setClubs(prevClubs => prevClubs.filter(club => club.id !== clubId));
      
      toast({
        title: 'Club Rejected',
        description: 'The club has been rejected.',
      });
    } catch (error) {
      console.error('Error rejecting club:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject the club.',
        variant: 'destructive',
      });
    }
  }, []);

  return {
    clubs,
    isLoading,
    fetchPendingClubs,
    approveClub: approveClubAction,
    rejectClub: rejectClubAction
  };
};
