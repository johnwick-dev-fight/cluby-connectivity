
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, MapPin, BookOpen, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const StudentProfile = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinedClubs, setJoinedClubs] = useState<any[]>([]);
  
  // Form fields
  const [fullName, setFullName] = useState(user?.profile?.full_name || '');
  const [department, setDepartment] = useState(user?.profile?.department || '');
  const [year, setYear] = useState(user?.profile?.year || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  
  // Mock interests (in a real app, this would be from the database)
  const interests = ['Programming', 'AI', 'Web Development', 'Data Science'];

  // Fetch joined clubs
  useEffect(() => {
    if (user) {
      fetchJoinedClubs();
    }
  }, [user]);

  const fetchJoinedClubs = async () => {
    try {
      const { data, error } = await supabase
        .from('club_members')
        .select(`
          id,
          role,
          status,
          clubs:club_id (
            id,
            name,
            logo_url
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'approved');
      
      if (error) throw error;
      setJoinedClubs(data || []);
    } catch (error) {
      console.error('Error fetching joined clubs:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          department,
          year,
          bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      await refreshUser();
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.profile?.avatar_url} alt={user?.profile?.full_name || ''} />
                <AvatarFallback className="text-lg">{user?.profile?.full_name?.charAt(0) || user?.email.charAt(0)}</AvatarFallback>
              </Avatar>
              {!isEditing ? (
                <div>
                  <CardTitle className="text-2xl">{user?.profile?.full_name || 'Student Name'}</CardTitle>
                  {user?.profile?.department && user?.profile?.year && (
                    <div className="flex items-center text-muted-foreground mt-1">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{user.profile.department}, {user.profile.year}</span>
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 w-full">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                  />
                </div>
              )}
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <>
              {user?.profile?.bio && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Bio</h3>
                  <p className="text-muted-foreground">{user.profile.bio}</p>
                </div>
              )}
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {interests.map(interest => (
                    <Badge key={interest} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Joined Clubs</h3>
                {joinedClubs.length > 0 ? (
                  <div className="space-y-3">
                    {joinedClubs.map((membership) => (
                      <div key={membership.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={membership.clubs.logo_url} alt={membership.clubs.name} />
                            <AvatarFallback>{membership.clubs.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{membership.clubs.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{membership.role}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/clubs/${membership.clubs.id}`}>View</a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">You haven't joined any clubs yet.</p>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department" 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)} 
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input 
                    id="year" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)} 
                    placeholder="e.g. 3rd Year"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
