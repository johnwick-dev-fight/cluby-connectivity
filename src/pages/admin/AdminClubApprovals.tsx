
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

const AdminClubApprovals = () => {
  // Mock pending clubs - in a real app, this would come from an API
  const [pendingClubs, setPendingClubs] = useState([
    { 
      id: '1', 
      name: 'Photography Club', 
      description: 'A club dedicated to photography enthusiasts. We organize photo walks, workshops, and exhibitions.', 
      representative: 'Jane Smith'
    },
    { 
      id: '2', 
      name: 'Coding Hub', 
      description: 'A community for coding enthusiasts to learn, collaborate and build projects together.', 
      representative: 'Mike Johnson'
    },
    { 
      id: '3', 
      name: 'Debate Society', 
      description: 'Platform for students to enhance their public speaking and critical thinking skills through debates and discussions.', 
      representative: 'Alex Wilson'
    }
  ]);
  
  const handleApprove = (id: string) => {
    // In a real app, this would make an API call
    setPendingClubs(pendingClubs.filter(club => club.id !== id));
    // Add success toast notification
  };
  
  const handleReject = (id: string) => {
    // In a real app, this would make an API call
    setPendingClubs(pendingClubs.filter(club => club.id !== id));
    // Add rejection toast notification
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Club Approvals</h1>
        <p className="text-muted-foreground">Review and approve club registration requests</p>
      </div>
      
      <div className="space-y-4">
        {pendingClubs.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-center text-muted-foreground">
                No pending club approval requests.
              </div>
            </CardContent>
          </Card>
        ) : (
          pendingClubs.map((club) => (
            <Card key={club.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{club.name}</CardTitle>
                    <CardDescription>Representative: {club.representative}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                    Pending Approval
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {club.description}
                </p>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-600" 
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    View Details
                  </Button>
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
    </div>
  );
};

export default AdminClubApprovals;
