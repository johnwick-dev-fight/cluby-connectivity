
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';

// Mock data for club approvals
const MOCK_CLUB_APPROVALS = [
  {
    id: '1',
    name: 'AI Research Club',
    representative: 'Alex Johnson',
    email: 'alex@example.com',
    submittedDate: '2023-10-15',
    category: 'Technology',
    description: 'A club focused on artificial intelligence research and applications.',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Dance Crew',
    representative: 'Sarah Williams',
    email: 'sarah@example.com',
    submittedDate: '2023-10-14',
    category: 'Arts',
    description: 'A group dedicated to various dance forms and performances.',
    status: 'pending'
  },
  {
    id: '3',
    name: 'Environmental Awareness Club',
    representative: 'Michael Brown',
    email: 'michael@example.com',
    submittedDate: '2023-10-10',
    category: 'Social',
    description: 'Promoting environmental consciousness and sustainability practices on campus.',
    status: 'pending'
  },
  {
    id: '4',
    name: 'Photography Club',
    representative: 'Emily Davis',
    email: 'emily@example.com',
    submittedDate: '2023-10-08',
    category: 'Arts',
    description: 'For students passionate about photography, from beginners to advanced.',
    status: 'approved'
  },
  {
    id: '5',
    name: 'Debate Society',
    representative: 'Daniel Wilson',
    email: 'daniel@example.com',
    submittedDate: '2023-10-05',
    category: 'Academic',
    description: 'Platform for students to discuss current issues and improve public speaking skills.',
    status: 'rejected'
  }
];

const ClubApprovals = () => {
  const [clubs, setClubs] = useState(MOCK_CLUB_APPROVALS);
  const [viewingClub, setViewingClub] = useState<typeof MOCK_CLUB_APPROVALS[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleViewDetails = (club: typeof MOCK_CLUB_APPROVALS[0]) => {
    setViewingClub(club);
    setIsDialogOpen(true);
  };
  
  const handleApprove = (clubId: string) => {
    setClubs(clubs.map(club => 
      club.id === clubId ? { ...club, status: 'approved' } : club
    ));
    
    toast({
      title: "Club approved",
      description: "The club has been approved and its representative has been notified.",
    });
    
    setIsDialogOpen(false);
  };
  
  const handleReject = (clubId: string) => {
    setClubs(clubs.map(club => 
      club.id === clubId ? { ...club, status: 'rejected' } : club
    ));
    
    toast({
      title: "Club rejected",
      description: "The club has been rejected and its representative has been notified.",
    });
    
    setIsDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Club Approvals</h1>
        <p className="text-muted-foreground">Manage club registration requests</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Club Approval Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clubs.map(club => (
              <div key={club.id} className="flex items-center justify-between p-4 rounded-md border">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{club.name}</h3>
                    {club.status === 'pending' && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Clock className="mr-1 h-3 w-3" /> Pending
                      </Badge>
                    )}
                    {club.status === 'approved' && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Approved
                      </Badge>
                    )}
                    {club.status === 'rejected' && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <XCircle className="mr-1 h-3 w-3" /> Rejected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{club.category} • Submitted by {club.representative} on {club.submittedDate}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(club)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  
                  {club.status === 'pending' && (
                    <>
                      <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(club.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleReject(club.id)}>
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {clubs.filter(club => club.status === 'pending').length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No pending club approval requests available.</p>
              </div>
            )}
          </div>
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
                <p>{viewingClub.category}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm">{viewingClub.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Representative</h4>
                <p>{viewingClub.representative}</p>
                <p className="text-sm text-muted-foreground">{viewingClub.email}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Submitted Date</h4>
                <p>{viewingClub.submittedDate}</p>
              </div>
            </div>
            
            {viewingClub.status === 'pending' && (
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={() => handleReject(viewingClub.id)}>Reject</Button>
                <Button onClick={() => handleApprove(viewingClub.id)}>Approve</Button>
              </DialogFooter>
            )}
            
            {viewingClub.status !== 'pending' && (
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClubApprovals;
