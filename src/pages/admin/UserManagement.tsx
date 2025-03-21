
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Search, Filter, Loader2, UserCircle, Mail, Calendar, Ban, CheckCircle, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

// Types for user data
interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  department?: string;
  year?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

// Updated interface to match actual data structure from the database
interface ClubRepresentative {
  representative_id: string;
  name: string;
}

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'block' | 'unblock' | 'makeAdmin' | null>(null);

  // Query to fetch user profiles
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Profile[];
    },
  });

  // Query to fetch club representatives
  const { data: clubReps } = useQuery({
    queryKey: ['club-representatives'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select('representative_id, name');

      if (error) {
        console.error("Error fetching club representatives:", error);
        return [];
      }

      return data as ClubRepresentative[];
    },
  });

  // Mutation for updating user role or status
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: string, action: 'block' | 'unblock' | 'makeAdmin' }) => {
      // This would require a custom RPC function or edge function to manipulate auth users
      // In a real app, you might use Supabase auth admin API or edge functions
      
      // Mock implementation for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, userId, action };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      
      let message = "User updated successfully.";
      if (data.action === 'block') {
        message = "User has been blocked.";
      } else if (data.action === 'unblock') {
        message = "User has been unblocked.";
      } else if (data.action === 'makeAdmin') {
        message = "User has been promoted to admin.";
      }
      
      toast({
        title: "Success",
        description: message,
      });
      
      setIsUserDialogOpen(false);
      setConfirmAction(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to update user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Function to handle user action confirmation
  const handleConfirmAction = () => {
    if (selectedUser && confirmAction) {
      updateUserMutation.mutate({ 
        userId: selectedUser.id, 
        action: confirmAction 
      });
    }
  };

  // Filter users based on search and active tab
  const filteredUsers = profiles?.filter(profile => {
    const matchesSearch = 
      (profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) || 
      (profile.username?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (profile.department?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const isClubRep = clubReps?.some(rep => rep.representative_id === profile.id) || false;
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'students') return matchesSearch && !isClubRep;
    if (activeTab === 'representatives') return matchesSearch && isClubRep;
    
    return matchesSearch;
  });

  // Get role badge for user
  const getUserRoleBadge = (userId: string) => {
    // Mock function - in a real app, would check auth metadata or roles table
    const isClubRep = clubReps?.some(rep => rep.representative_id === userId) || false;
    
    if (userId === 'admin-id') { // Replace with actual admin check
      return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Admin</Badge>;
    } else if (isClubRep) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Club Representative</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 border-green-300">Student</Badge>;
    }
  };

  // Function to get club name for representatives
  const getClubName = (userId: string): string => {
    const club = clubReps?.find(rep => rep.representative_id === userId);
    return club ? club.name : '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage and monitor user accounts</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="sm:w-auto w-full">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="representatives">Club Representatives</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((profile) => (
                  <Card key={profile.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {profile.avatar_url ? (
                            <img 
                              src={profile.avatar_url}
                              alt={profile.full_name || 'User avatar'}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <UserCircle className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-xl">{profile.full_name || 'Unnamed User'}</CardTitle>
                            <CardDescription>
                              {profile.username ? `@${profile.username}` : 'No username'}
                              {clubReps?.some(rep => rep.representative_id === profile.id) && 
                                ` • ${getClubName(profile.id)}`
                              }
                            </CardDescription>
                          </div>
                        </div>
                        {getUserRoleBadge(profile.id)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Email placeholder</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {format(new Date(profile.created_at), 'PPP')}
                          </span>
                        </div>
                        {profile.department && (
                          <div className="flex items-center">
                            <ShieldAlert className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{profile.department}</span>
                          </div>
                        )}
                      </div>
                      
                      {profile.bio && (
                        <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                          {profile.bio}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(profile);
                          setIsUserDialogOpen(true);
                        }}
                      >
                        Manage
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-10">
                    <div className="text-center text-muted-foreground">
                      No users found matching your criteria
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* User Management Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Manage User</DialogTitle>
                <DialogDescription>
                  {selectedUser.full_name || 'User'} 
                  {clubReps?.some(rep => rep.representative_id === selectedUser.id) && 
                    ` - Representative of ${getClubName(selectedUser.id)}`
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="flex items-center justify-center">
                  {selectedUser.avatar_url ? (
                    <img 
                      src={selectedUser.avatar_url}
                      alt={selectedUser.full_name || 'User avatar'}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                      <UserCircle className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Full Name</h4>
                    <p>{selectedUser.full_name || 'Not provided'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Username</h4>
                    <p>{selectedUser.username ? `@${selectedUser.username}` : 'Not provided'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Department</h4>
                    <p>{selectedUser.department || 'Not provided'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Year</h4>
                    <p>{selectedUser.year || 'Not provided'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Joined</h4>
                    <p>{format(new Date(selectedUser.created_at), 'PPP')}</p>
                  </div>
                  
                  {selectedUser.bio && (
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Bio</h4>
                      <p className="text-sm">{selectedUser.bio}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setConfirmAction('block');
                  }}
                >
                  <Ban className="h-4 w-4 mr-1" /> 
                  Block User
                </Button>
                <Button 
                  variant="default"
                  onClick={() => {
                    setConfirmAction('makeAdmin');
                  }}
                >
                  <ShieldAlert className="h-4 w-4 mr-1" /> 
                  Make Admin
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog */}
      {confirmAction && (
        <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {confirmAction === 'block' && "Block User"}
                {confirmAction === 'unblock' && "Unblock User"}
                {confirmAction === 'makeAdmin' && "Make User an Admin"}
              </DialogTitle>
              <DialogDescription>
                {confirmAction === 'block' && "This will prevent the user from accessing the platform."}
                {confirmAction === 'unblock' && "This will restore the user's access to the platform."}
                {confirmAction === 'makeAdmin' && "This will grant the user administrative privileges."}
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </Button>
              <Button 
                variant={confirmAction === 'block' ? "destructive" : "default"}
                onClick={handleConfirmAction}
              >
                {confirmAction === 'block' && <Ban className="h-4 w-4 mr-1" />}
                {confirmAction === 'unblock' && <CheckCircle className="h-4 w-4 mr-1" />}
                {confirmAction === 'makeAdmin' && <ShieldAlert className="h-4 w-4 mr-1" />}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserManagement;
