
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Shield, AlertCircle, BarChart, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminProfile = () => {
  const { user } = useAuth();
  
  // Mock admin data
  const adminData = {
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@example.com',
    position: 'Platform Administrator',
    stats: {
      pendingClubs: 5,
      totalClubs: 32,
      totalStudents: 1256,
      reportedContent: 3
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar} alt={adminData.name} />
                <AvatarFallback className="text-lg">{adminData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{adminData.name}</CardTitle>
                <div className="text-lg font-medium text-cluby-600">{adminData.position}</div>
                <div className="flex items-center text-muted-foreground mt-1">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{adminData.email}</span>
                </div>
              </div>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <h3 className="font-medium mb-2">Platform Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
              <div className="bg-gray-50 p-3 rounded-md flex items-center space-x-3">
                <Shield className="h-5 w-5 text-cluby-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Clubs</p>
                  <p className="font-medium">{adminData.stats.pendingClubs}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md flex items-center space-x-3">
                <Users className="h-5 w-5 text-cluby-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Clubs</p>
                  <p className="font-medium">{adminData.stats.totalClubs}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md flex items-center space-x-3">
                <BarChart className="h-5 w-5 text-cluby-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="font-medium">{adminData.stats.totalStudents}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-cluby-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Reported Content</p>
                  <p className="font-medium">{adminData.stats.reportedContent}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Administration</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">Club Approvals</p>
                  <p className="text-sm text-muted-foreground">Review and manage club registrations</p>
                </div>
                <Button variant="secondary" size="sm">Manage</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">User Management</p>
                  <p className="text-sm text-muted-foreground">Manage student and club representative accounts</p>
                </div>
                <Button variant="secondary" size="sm">View</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">Content Moderation</p>
                  <p className="text-sm text-muted-foreground">Review reported content and take action</p>
                </div>
                <Button variant="secondary" size="sm">Review</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">Platform Settings</p>
                  <p className="text-sm text-muted-foreground">Configure platform-wide settings</p>
                </div>
                <Button variant="secondary" size="sm">Configure</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
