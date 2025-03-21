
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, Eye, Loader2 } from 'lucide-react';
import { useClubApprovals } from '@/hooks/useClubApprovals';
import { supabase } from '@/integrations/supabase/client';

interface RepresentativeDetails {
  email: string;
  full_name: string;
}

const ClubApprovals = () => {
  const { clubs, isLoading, fetchPendingClubs, approveClub, rejectClub } = useClubApprovals();
  const [viewingClub, setViewingClub] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [representativeDetails, setRepresentativeDetails] = useState<Record<string, RepresentativeDetails>>({});
  
  useEffect(() => {
    fetchPendingClubs();
  }, []);
  
  useEffect(() => {
    const fetchRepresentativeDetails = async () => {
      const representativeIds = clubs.map(club => club.representative_id);
      if (representativeIds.length === 0) return;
      
      try {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', representativeIds);
          
        const { data: users } = await supabase.auth.admin.listUsers();
        
        const details: Record<string, RepresentativeDetails> = {};
        
        profiles?.forEach(profile => {
          const user = users?.users.find(u => u.id === profile.id);
          if (user) {
            details[profile.id] = {
              email: user.email || '',
              full_name: profile.full_name || ''
            };
          }
        });
        
        setRepresentativeDetails(details);
      } catch (error) {
        console.error('Error fetching representative details', error);
      }
    };
    
    fetchRepresentativeDetails();
  }, [clubs]);
  
  const handleViewDetails = (club: any) => {
    setViewingClub(club);
    setIsDialogOpen(true);
  };
  
  const handleApprove = (clubId: string) => {
    approveClub(clubId);
    setIsDialogOpen(false);
  };
  
  const handleReject = (clubId: string) => {
    rejectClub(clubId);
    setIsDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Club Approvals</h1>
        <p className="text-muted-foreground">Manage club registration requests</p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Club Approval Requests</CardTitle>
          <Button variant="outline" size="sm" onClick={() => fetchPendingClubs()}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {clubs.filter(club => club.status === 'pending').map(club => (
                <div key={club.id} className="flex items-center justify-between p-4 rounded-md border">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{club.name}</h3>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Clock className="mr-1 h-3 w-3" /> Pending
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Category: {club.category || 'Not specified'} • 
                      Representative: {representativeDetails[club.representative_id]?.full_name || 'Unknown'} • 
                      Submitted on {new Date(club.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(club)}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    
                    <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(club.id)}>
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleReject(club.id)}>
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
              
              {clubs.filter(club => club.status === 'pending').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No pending club approval requests available.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {viewingClub && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{viewingClub.name}</DialogTitle>
              <DialogDescription>Review club details before making a decision</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-medium">Category</h4>
                <p>{viewingClub.category || 'Not specified'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm">{viewingClub.description || 'No description provided'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Objectives</h4>
                <p className="text-sm">{viewingClub.objectives || 'No objectives provided'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Representative</h4>
                <p>{representativeDetails[viewingClub.representative_id]?.full_name || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">
                  {representativeDetails[viewingClub.representative_id]?.email || 'Email not available'}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Submitted Date</h4>
                <p>{new Date(viewingClub.created_at).toLocaleString()}</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleReject(viewingClub.id)}>Reject</Button>
              <Button onClick={() => handleApprove(viewingClub.id)}>Approve</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClubApprovals;
