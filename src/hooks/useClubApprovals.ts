
import { useState, useCallback } from 'react';
import { getPendingClubs, approveClub, rejectClub } from '@/lib/mongodb/services/clubService';
import { toast } from '@/components/ui/use-toast';

export interface Club {
  id: string;
  name: string;
  representative_id: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const useClubApprovals = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPendingClubs = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getPendingClubs();
      
      if (error) {
        throw error;
      }
      
      setClubs(data || []);
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
      const { data, error } = await approveClub(clubId);
      
      if (error) {
        throw error;
      }
      
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
      const { data, error } = await rejectClub(clubId);
      
      if (error) {
        throw error;
      }
      
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
