
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, BookOpen, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const StudentProfile = () => {
  const { user } = useAuth();
  
  // Mock student data
  const studentData = {
    name: user?.name || 'Student Name',
    email: user?.email || 'student@example.com',
    department: 'Computer Science',
    year: '3rd Year',
    interests: ['Programming', 'AI', 'Web Development', 'Data Science'],
    joinedClubs: [
      { id: '1', name: 'Programming Club', role: 'Member' },
      { id: '2', name: 'Photography Club', role: 'Active Member' }
    ]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar} alt={studentData.name} />
                <AvatarFallback className="text-lg">{studentData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{studentData.name}</CardTitle>
                <div className="flex items-center text-muted-foreground mt-1">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{studentData.department}, {studentData.year}</span>
                </div>
                <div className="flex items-center text-muted-foreground mt-1">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{studentData.email}</span>
                </div>
              </div>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <h3 className="font-medium mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {studentData.interests.map(interest => (
                <Badge key={interest} variant="secondary">{interest}</Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Joined Clubs</h3>
            <div className="space-y-3">
              {studentData.joinedClubs.map(club => (
                <div key={club.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">{club.name}</p>
                    <p className="text-sm text-muted-foreground">{club.role}</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
