
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Users, BarChart, BookOpen, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import StudentApplications from '@/components/dashboard/StudentApplications';
import CRPRecruitment from '@/components/dashboard/CRPRecruitment';
import SeedDatabase from '@/components/admin/SeedDatabase';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Cluby, your platform for campus clubs and activities.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Quick Actions Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to do</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="justify-start" 
              onClick={() => navigate('/clubs')}
            >
              <Users className="mr-2 h-4 w-4" />
              Browse Clubs
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/events')}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Upcoming Events
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => navigate('/community')}
            >
              <Bell className="mr-2 h-4 w-4" />
              Community Updates
            </Button>
          </CardContent>
        </Card>
        
        {/* Stats Overview Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Your recent platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="clubs">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="clubs">Clubs</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
              </TabsList>
              <TabsContent value="clubs" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Clubs Joined</span>
                  <span className="text-2xl font-bold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Applications</span>
                  <span className="text-2xl font-bold">0</span>
                </div>
              </TabsContent>
              <TabsContent value="events" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Upcoming</span>
                  <span className="text-2xl font-bold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Attended</span>
                  <span className="text-2xl font-bold">0</span>
                </div>
              </TabsContent>
              <TabsContent value="posts" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Your Posts</span>
                  <span className="text-2xl font-bold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Interactions</span>
                  <span className="text-2xl font-bold">0</span>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Show applications for students */}
      {user?.role === 'student' && (
        <StudentApplications />
      )}
      
      {/* Show recruitment management for CRPs */}
      {user?.role === 'clubRepresentative' && (
        <CRPRecruitment />
      )}
      
      {/* Admin Section */}
      {user?.role === 'admin' && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Admin Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Database Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SeedDatabase />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => navigate('/admin/users')}
                >
                  Manage Users
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Club Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => navigate('/admin/club-approvals')}
                >
                  Review Clubs
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">System Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => navigate('/admin/overview')}
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
