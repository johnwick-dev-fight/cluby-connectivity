import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Users, Briefcase, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import MongoDBStatus from '@/components/MongoDBStatus';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'clubRepresentative':
        return <ClubRepDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* MongoDB Connection Status Card */}
      <div className="mb-8">
        <MongoDBStatus />
      </div>
      
      {renderDashboardContent()}
    </div>
  );
};

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="My Clubs" 
          value="2" 
          description="Clubs you're a member of" 
          icon={<Users className="h-5 w-5 text-blue-600" />}
          linkTo="/clubs"
        />
        <DashboardCard 
          title="Upcoming Events" 
          value="3" 
          description="Events this week" 
          icon={<CalendarDays className="h-5 w-5 text-emerald-600" />}
          linkTo="/events"
        />
        <DashboardCard 
          title="Open Positions" 
          value="8" 
          description="Recruitment opportunities" 
          icon={<Briefcase className="h-5 w-5 text-amber-600" />}
          linkTo="/recruit"
        />
        <DashboardCard 
          title="Community Posts" 
          value="12" 
          description="New posts today" 
          icon={<MessageSquare className="h-5 w-5 text-purple-600" />}
          linkTo="/community"
        />
      </div>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Your Activity</h2>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <ApplicationItem 
                  club="Programming Club" 
                  position="Web Developer" 
                  status="pending" 
                  date="Oct 12, 2023"
                />
                <ApplicationItem 
                  club="Photography Club" 
                  position="Event Coordinator" 
                  status="approved" 
                  date="Oct 5, 2023"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <EventItem 
                  name="Web Development Workshop" 
                  club="Programming Club" 
                  date="Oct 25, 2023" 
                  location="Computer Lab"
                />
                <EventItem 
                  name="Photography Contest" 
                  club="Photography Club" 
                  date="Nov 2, 2023" 
                  location="Art Gallery"
                />
                <EventItem 
                  name="Fresher's Party" 
                  club="Student Council" 
                  date="Nov 10, 2023" 
                  location="Auditorium"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ClubRepDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Club Members" 
          value="24" 
          description="Active members" 
          icon={<Users className="h-5 w-5 text-blue-600" />}
          linkTo="/club-management"
        />
        <DashboardCard 
          title="Club Events" 
          value="2" 
          description="Upcoming events" 
          icon={<CalendarDays className="h-5 w-5 text-emerald-600" />}
          linkTo="/events"
        />
        <DashboardCard 
          title="Open Positions" 
          value="3" 
          description="Active recruitments" 
          icon={<Briefcase className="h-5 w-5 text-amber-600" />}
          linkTo="/recruit"
        />
        <DashboardCard 
          title="Membership Requests" 
          value="7" 
          description="Pending requests" 
          icon={<Users className="h-5 w-5 text-purple-600" />}
          linkTo="/club-management"
        />
      </div>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Club Management</h2>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <ApplicationReview 
                  name="John Doe" 
                  position="Web Developer" 
                  appliedDate="Oct 12, 2023"
                />
                <ApplicationReview 
                  name="Jane Smith" 
                  position="Content Writer" 
                  appliedDate="Oct 10, 2023"
                />
                <ApplicationReview 
                  name="Mike Johnson" 
                  position="Event Coordinator" 
                  appliedDate="Oct 8, 2023"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Club Events</CardTitle>
              <Button variant="outline" size="sm">
                <Link to="/events/create">Add Event</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <EventManagement 
                  name="Tech Talk Series" 
                  date="Oct 28, 2023" 
                  attendees={42}
                />
                <EventManagement 
                  name="Coding Competition" 
                  date="Nov 15, 2023" 
                  attendees={18}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Total Clubs" 
          value="32" 
          description="Active on platform" 
          icon={<Users className="h-5 w-5 text-blue-600" />}
          linkTo="/admin/clubs"
        />
        <DashboardCard 
          title="Total Students" 
          value="1,256" 
          description="Registered users" 
          icon={<Users className="h-5 w-5 text-emerald-600" />}
          linkTo="/admin/users"
        />
        <DashboardCard 
          title="New Clubs" 
          value="5" 
          description="Pending approval" 
          icon={<Briefcase className="h-5 w-5 text-amber-600" />}
          linkTo="/admin/club-approvals"
        />
        <DashboardCard 
          title="Platform Events" 
          value="28" 
          description="This month" 
          icon={<CalendarDays className="h-5 w-5 text-purple-600" />}
          linkTo="/admin/events"
        />
      </div>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Administration</h2>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Club Approval Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <ClubApproval 
                  name="AI Research Club" 
                  representative="Alex Johnson" 
                  submittedDate="Oct 15, 2023"
                />
                <ClubApproval 
                  name="Dance Crew" 
                  representative="Sarah Williams" 
                  submittedDate="Oct 14, 2023"
                />
                <ClubApproval 
                  name="Environmental Awareness Club" 
                  representative="Michael Brown" 
                  submittedDate="Oct 10, 2023"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <ActivityLog 
                  action="New club registered" 
                  details="Photography Club" 
                  date="Oct 18, 2023" 
                  time="14:32"
                />
                <ActivityLog 
                  action="Event deleted" 
                  details="Chess Tournament by Chess Club" 
                  date="Oct 18, 2023" 
                  time="11:15"
                />
                <ActivityLog 
                  action="User reported" 
                  details="Inappropriate behavior in community" 
                  date="Oct 17, 2023" 
                  time="16:45"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, description, icon, linkTo }: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
  linkTo: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
      </div>
      <div className="mt-4">
        <Link to={linkTo} className="text-sm text-cluby-700 hover:underline">
          View details
        </Link>
      </div>
    </CardContent>
  </Card>
);

const ApplicationItem = ({ club, position, status, date }: { 
  club: string; 
  position: string; 
  status: 'pending' | 'approved' | 'rejected'; 
  date: string;
}) => (
  <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
    <div>
      <p className="font-medium">{position}</p>
      <p className="text-sm text-gray-500">{club}</p>
    </div>
    <div className="flex items-center">
      <span className={`px-2 py-1 text-xs rounded-full ${
        status === 'pending' ? 'bg-amber-100 text-amber-800' : 
        status === 'approved' ? 'bg-green-100 text-green-800' : 
        'bg-red-100 text-red-800'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      <span className="ml-4 text-sm text-gray-500">{date}</span>
    </div>
  </div>
);

const EventItem = ({ name, club, date, location }: { 
  name: string; 
  club: string; 
  date: string; 
  location: string;
}) => (
  <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">{club}</p>
    </div>
    <div className="text-right">
      <p className="text-sm">{date}</p>
      <p className="text-sm text-gray-500">{location}</p>
    </div>
  </div>
);

const ApplicationReview = ({ name, position, appliedDate }: { 
  name: string; 
  position: string; 
  appliedDate: string;
}) => (
  <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">{position}</p>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">{appliedDate}</span>
      <Button variant="secondary" size="sm">View</Button>
    </div>
  </div>
);

const EventManagement = ({ name, date, attendees }: { 
  name: string; 
  date: string; 
  attendees: number;
}) => (
  <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">{attendees} attendees</span>
      <Button variant="secondary" size="sm">Manage</Button>
    </div>
  </div>
);

const ClubApproval = ({ name, representative, submittedDate }: { 
  name: string; 
  representative: string; 
  submittedDate: string;
}) => (
  <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">By {representative}</p>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">{submittedDate}</span>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm">Review</Button>
        <Button variant="outline" size="sm" className="text-green-600">Approve</Button>
      </div>
    </div>
  </div>
);

const ActivityLog = ({ action, details, date, time }: { 
  action: string; 
  details: string; 
  date: string; 
  time: string;
}) => (
  <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
    <div>
      <p className="font-medium">{action}</p>
      <p className="text-sm text-gray-500">{details}</p>
    </div>
    <div className="text-right">
      <p className="text-sm">{date}</p>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
  </div>
);

export default Dashboard;
