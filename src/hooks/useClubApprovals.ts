
import { useState } from 'react';
import { getPendingClubs, approveClub, rejectClub } from '@/lib/mongodb/services/clubService';
import { toast } from '@/components/ui/use-toast';

interface Club {
  id: string;
  name: string;
  description?: string;
  representative_id: string;
  status: string;
  [key: string]: any;
}

export const useClubApprovals = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clubs, setClubs] = useState<Club[]>([]);

  const fetchPendingClubs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getPendingClubs();
      
      if (error) throw error;
      
      setClubs(data || []);
    } catch (error: any) {
      console.error('Error fetching pending clubs:', error);
      toast({
        title: "Error fetching clubs",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveClub = async (clubId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await approveClub(clubId);
      
      if (error) throw error;
      
      // Update local state
      setClubs(clubs.filter(club => club.id !== clubId));
      
      toast({
        title: "Club approved",
        description: "The club has been successfully approved.",
      });
    } catch (error: any) {
      console.error('Error approving club:', error);
      toast({
        title: "Error approving club",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectClub = async (clubId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await rejectClub(clubId);
      
      if (error) throw error;
      
      // Update local state
      setClubs(clubs.filter(club => club.id !== clubId));
      
      toast({
        title: "Club rejected",
        description: "The club has been rejected.",
      });
    } catch (error: any) {
      console.error('Error rejecting club:', error);
      toast({
        title: "Error rejecting club",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clubs,
    isLoading,
    fetchPendingClubs,
    approveClub: handleApproveClub,
    rejectClub: handleRejectClub
  };
};
