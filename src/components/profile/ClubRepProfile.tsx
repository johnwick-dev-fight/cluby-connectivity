
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Users, CalendarDays, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ClubRepProfile = () => {
  const { user } = useAuth();
  
  // Mock club representative data
  const repData = {
    name: user?.name || 'Club Representative',
    email: user?.email || 'clubrep@example.com',
    position: 'President',
    club: {
      id: '1',
      name: 'Programming Club',
      founded: '2019',
      members: 42,
      description: 'A community for students interested in programming and software development.',
      upcomingEvents: 3,
      openPositions: 2
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar} alt={repData.name} />
                <AvatarFallback className="text-lg">{repData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{repData.name}</CardTitle>
                <div className="text-lg font-medium text-cluby-600">{repData.position} at {repData.club.name}</div>
                <div className="flex items-center text-muted-foreground mt-1">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{repData.email}</span>
                </div>
              </div>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <h3 className="font-medium mb-2">Club Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="bg-gray-50 p-3 rounded-md flex items-center space-x-3">
                <Users className="h-5 w-5 text-cluby-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="font-medium">{repData.club.members}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md flex items-center space-x-3">
                <CalendarDays className="h-5 w-5 text-cluby-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Events</p>
                  <p className="font-medium">{repData.club.upcomingEvents}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md flex items-center space-x-3">
                <Building className="h-5 w-5 text-cluby-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Founded</p>
                  <p className="font-medium">{repData.club.founded}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Club Management</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">Manage Club Profile</p>
                  <p className="text-sm text-muted-foreground">Update club details and information</p>
                </div>
                <Button variant="secondary" size="sm">Manage</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">Open Positions ({repData.club.openPositions})</p>
                  <p className="text-sm text-muted-foreground">Manage recruitment and applications</p>
                </div>
                <Button variant="secondary" size="sm">View</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">Membership Requests</p>
                  <p className="text-sm text-muted-foreground">Review and approve member applications</p>
                </div>
                <Button variant="secondary" size="sm">Review</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubRepProfile;
