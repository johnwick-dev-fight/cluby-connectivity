
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('status', 'pending');
      
      if (error) throw error;
      setClubs(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching clubs",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveClub = async (clubId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('clubs')
        .update({ status: 'approved' })
        .eq('id', clubId);
      
      if (error) throw error;
      
      // Update local state
      setClubs(clubs.map(club => 
        club.id === clubId ? { ...club, status: 'approved' } : club
      ));
      
      toast({
        title: "Club approved",
        description: "The club has been successfully approved.",
      });
    } catch (error: any) {
      toast({
        title: "Error approving club",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rejectClub = async (clubId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('clubs')
        .update({ status: 'rejected' })
        .eq('id', clubId);
      
      if (error) throw error;
      
      // Update local state
      setClubs(clubs.map(club => 
        club.id === clubId ? { ...club, status: 'rejected' } : club
      ));
      
      toast({
        title: "Club rejected",
        description: "The club has been rejected.",
      });
    } catch (error: any) {
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
    approveClub,
    rejectClub
  };
};
