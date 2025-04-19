
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, BookOpen, Calendar, UserCheck, TrendingUp, BarChart2 } from 'lucide-react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

const AdminOverview = () => {
  // Mock data for dashboard stats
  const stats = [
    { title: 'Total Users', value: '1,245', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { title: 'Active Clubs', value: '32', icon: BookOpen, color: 'bg-green-100 text-green-600' },
    { title: 'Events This Month', value: '18', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
    { title: 'New Applications', value: '54', icon: UserCheck, color: 'bg-amber-100 text-amber-600' },
  ];
  
  // Mock data for activity chart
  const activityData = [
    { name: 'Jan', users: 30, events: 10, applications: 5 },
    { name: 'Feb', users: 45, events: 12, applications: 8 },
    { name: 'Mar', users: 55, events: 15, applications: 12 },
    { name: 'Apr', users: 65, events: 18, applications: 14 },
    { name: 'May', users: 90, events: 20, applications: 22 },
    { name: 'Jun', users: 100, events: 25, applications: 28 },
  ];
  
  // Mock data for club distribution
  const clubData = [
    { name: 'Technical', value: 12 },
    { name: 'Cultural', value: 8 },
    { name: 'Sports', value: 6 },
    { name: 'Academic', value: 4 },
    { name: 'Others', value: 2 },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Overview</h1>
        <p className="text-muted-foreground">Monitor platform activity and statistics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Platform Activity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>User growth and platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="events" stroke="#10b981" />
                  <Line type="monotone" dataKey="applications" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Club Distribution</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>Number of clubs by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clubData}>
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
    </div>
  );
};

export default AdminOverview;
