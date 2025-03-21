
import React, { useEffect } from 'react';
import { useClubApprovals } from '@/hooks/useClubApprovals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ClubApprovals = () => {
  const { clubs, isLoading, fetchPendingClubs, approveClub, rejectClub } = useClubApprovals();
  
  useEffect(() => {
    fetchPendingClubs();
  }, [fetchPendingClubs]);
  
  const handleApprove = (clubId: string) => {
    approveClub(clubId);
  };
  
  const handleReject = (clubId: string) => {
    rejectClub(clubId);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Club Approvals</h1>
        <p className="text-muted-foreground">Review and manage club registration requests</p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {clubs.length === 0 ? (
            <Card>
              <CardContent className="py-10">
                <div className="text-center text-muted-foreground">
                  No pending club approval requests.
                </div>
              </CardContent>
            </Card>
          ) : (
            clubs.map((club) => (
              <Card key={club.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{club.name}</CardTitle>
                      <CardDescription>Representative: {club.representative_id}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                      Pending Approval
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {club.description || "No description provided"}
                  </p>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600" 
                      onClick={() => handleReject(club.id)}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(club.id)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ClubApprovals;
