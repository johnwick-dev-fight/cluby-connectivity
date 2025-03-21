
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { 
  MoreHorizontal, 
  Loader2, 
  Shield, 
  User, 
  Users, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  Award
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

// Define interfaces
interface ClubRepresentative {
  id: string;
  name: string;
  club_id: string;
  email?: string;
  created_at?: string;
}

interface Student {
  id: string;
  full_name: string;
  email: string;
  department?: string;
  year?: string;
  created_at: string;
}

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('students');
  
  // Fetch students
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          department,
          year,
          created_at,
          username
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Fetch email for each user from auth.users (would need admin access)
      // For now, just populate with a placeholder
      const studentsWithEmail = data.map(student => ({
        ...student,
        email: `${student.username || 'user'}@example.com`
      }));
      
      return studentsWithEmail as Student[];
    },
    enabled: activeTab === 'students',
  });
  
  // Fetch club representatives
  const { data: clubReps, isLoading: clubRepsLoading } = useQuery({
    queryKey: ['admin-club-reps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select(`
          id as club_id,
          name,
          representative_id as id
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data as ClubRepresentative[];
    },
    enabled: activeTab === 'club-reps',
  });
  
  // Ban user mutation (simulated)
  const banUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // This would typically call a Supabase Function or API to ban the user
      // For now, just return the user ID
      return userId;
    },
    onSuccess: (userId) => {
      toast({
        title: "User banned",
        description: "The user has been banned from the platform.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to ban user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Delete user mutation (simulated)
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // This would typically call a Supabase Function or API to delete the user
      // For now, just return the user ID
      return userId;
    },
    onSuccess: (userId) => {
      toast({
        title: "User deleted",
        description: "The user has been permanently deleted from the platform.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const renderStudentsTable = () => {
    if (studentsLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!students || students.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mb-2" />
          <h3 className="text-lg font-medium">No students found</h3>
          <p>There are no student accounts registered on the platform.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableCaption>List of all student accounts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{student.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{student.full_name}</span>
                </div>
              </TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.department || 'Not specified'}</TableCell>
              <TableCell>{student.year || 'Not specified'}</TableCell>
              <TableCell>{format(new Date(student.created_at), 'MMM d, yyyy')}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem 
                      className="flex items-center"
                      onClick={() => {
                        // View profile logic
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center"
                      onClick={() => {
                        // Edit user logic
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex items-center text-amber-600"
                      onClick={() => banUserMutation.mutate(student.id)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Ban User
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center text-red-600"
                      onClick={() => deleteUserMutation.mutate(student.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderClubRepsTable = () => {
    if (clubRepsLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!clubReps || clubReps.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mb-2" />
          <h3 className="text-lg font-medium">No club representatives found</h3>
          <p>There are no club representative accounts registered on the platform.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableCaption>List of all club representative accounts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Club</TableHead>
            <TableHead>Representative ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubReps.map((rep) => (
            <TableRow key={rep.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{rep.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{rep.name}</span>
                </div>
              </TableCell>
              <TableCell>{rep.id}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  Active
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem 
                      className="flex items-center"
                      onClick={() => {
                        // View club logic
                      }}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      View Club
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center"
                      onClick={() => {
                        // View rep profile logic
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex items-center text-amber-600"
                      onClick={() => banUserMutation.mutate(rep.id)}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Ban Representative
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center text-red-600"
                      onClick={() => deleteUserMutation.mutate(rep.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Representative
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>View and manage all user accounts on the platform</CardDescription>
            </div>
            <Button>
              <User className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="students" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="students" onClick={() => setActiveTab('students')}>
                <User className="h-4 w-4 mr-2" />
                Students
              </TabsTrigger>
              <TabsTrigger value="club-reps" onClick={() => setActiveTab('club-reps')}>
                <Award className="h-4 w-4 mr-2" />
                Club Representatives
              </TabsTrigger>
              <TabsTrigger value="admins">
                <Shield className="h-4 w-4 mr-2" />
                Admins
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="students" className="mt-6">
              {renderStudentsTable()}
            </TabsContent>
            
            <TabsContent value="club-reps" className="mt-6">
              {renderClubRepsTable()}
            </TabsContent>
            
            <TabsContent value="admins" className="mt-6">
              <Table>
                <TableCaption>List of all admin accounts</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">Admin User</span>
                      </div>
                    </TableCell>
                    <TableCell>admin@cluby.com</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                        Super Admin
                      </Badge>
                    </TableCell>
                    <TableCell>Now</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
