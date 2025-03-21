
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronUp, Users, CalendarCheck, Briefcase, MessageSquare, ShieldAlert, Award, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Stats cards for different metrics
const StatCard = ({ title, value, description, icon, trend, loading = false }: { 
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  trend?: {value: number; label: string};
  loading?: boolean;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="flex items-center justify-center h-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {trend && (
            <div className="flex items-center pt-1">
              <ChevronUp className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-emerald-500">{trend.value}% {trend.label}</span>
            </div>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

const AdminOverview = () => {
  // Query to fetch platform statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Fetch counts from various tables
      const [
        clubsResult,
        usersResult,
        eventsResult,
        positionsResult,
        pendingClubsResult,
        postsResult,
      ] = await Promise.all([
        supabase.from('clubs').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('recruitment_positions').select('id', { count: 'exact', head: true }),
        supabase.from('clubs').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('posts').select('id', { count: 'exact', head: true }),
      ]);

      const clubsCount = clubsResult.count || 0;
      const usersCount = usersResult.count || 0;
      const eventsCount = eventsResult.count || 0;
      const positionsCount = positionsResult.count || 0;
      const pendingClubsCount = pendingClubsResult.count || 0;
      const postsCount = postsResult.count || 0;

      if (clubsResult.error || usersResult.error || eventsResult.error || 
          positionsResult.error || pendingClubsResult.error || postsResult.error) {
        throw new Error('Failed to fetch statistics');
      }

      return {
        clubsCount,
        usersCount,
        eventsCount,
        positionsCount,
        pendingClubsCount,
        postsCount,
      };
    },
  });

  // Sample data for charts
  const clubActivityData = [
    { name: 'Events', value: stats?.eventsCount || 0 },
    { name: 'Posts', value: stats?.postsCount || 0 },
    { name: 'Positions', value: stats?.positionsCount || 0 },
  ];

  const weeklyActivityData = [
    { name: 'Mon', Events: 4, Posts: 7, Positions: 2 },
    { name: 'Tue', Events: 5, Posts: 9, Positions: 1 },
    { name: 'Wed', Events: 7, Posts: 12, Positions: 3 },
    { name: 'Thu', Events: 4, Posts: 8, Positions: 2 },
    { name: 'Fri', Events: 8, Posts: 15, Positions: 4 },
    { name: 'Sat', Events: 10, Posts: 12, Positions: 1 },
    { name: 'Sun', Events: 6, Posts: 10, Positions: 2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Users" 
          value={statsLoading ? '-' : stats?.usersCount || 0} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
          description="Total registered users"
          trend={{ value: 12, label: 'from last month' }}
          loading={statsLoading}
        />
        <StatCard 
          title="Total Clubs" 
          value={statsLoading ? '-' : stats?.clubsCount || 0}
          icon={<Award className="h-4 w-4 text-muted-foreground" />}
          description="Active and pending clubs"
          loading={statsLoading}
        />
        <StatCard 
          title="Pending Approvals" 
          value={statsLoading ? '-' : stats?.pendingClubsCount || 0}
          icon={<ShieldAlert className="h-4 w-4 text-muted-foreground" />}
          description="Clubs requiring review"
          loading={statsLoading}
        />
        <StatCard 
          title="Events" 
          value={statsLoading ? '-' : stats?.eventsCount || 0}
          icon={<CalendarCheck className="h-4 w-4 text-muted-foreground" />}
          description="Total scheduled events"
          trend={{ value: 8, label: 'from last month' }}
          loading={statsLoading}
        />
        <StatCard 
          title="Open Positions" 
          value={statsLoading ? '-' : stats?.positionsCount || 0}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
          description="Active recruitment positions"
          loading={statsLoading}
        />
        <StatCard 
          title="Community Posts" 
          value={statsLoading ? '-' : stats?.postsCount || 0}
          icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
          description="Total posts and announcements"
          trend={{ value: 15, label: 'from last month' }}
          loading={statsLoading}
        />
      </div>

      <Tabs defaultValue="activity">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Platform engagement over the last week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Events" fill="#8884d8" />
                    <Bar dataKey="Posts" fill="#82ca9d" />
                    <Bar dataKey="Positions" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New club created</p>
                      <p className="text-xs text-muted-foreground">Photography Club - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CalendarCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New event scheduled</p>
                      <p className="text-xs text-muted-foreground">Coding Workshop - 5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-muted-foreground">John Smith - 8 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Club Activity</CardTitle>
                <CardDescription>Club contributions by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clubActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>Growth and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">User analytics dashboard coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clubs">
          <Card>
            <CardHeader>
              <CardTitle>Club Analytics</CardTitle>
              <CardDescription>Club performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">Club analytics dashboard coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOverview;
