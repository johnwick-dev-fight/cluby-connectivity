
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { User, BellRing, ShieldAlert, Key } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings updated",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellRing className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Key className="h-4 w-4" /> Account
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.profile?.full_name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
              </div>
              
              {user?.role === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue="Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" defaultValue="3rd Year" />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" defaultValue="Student at Example University" />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                    <span>Email Notifications</span>
                    <span className="font-normal text-muted-foreground text-sm">
                      Receive email notifications for important updates
                    </span>
                  </Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="club-updates" className="flex flex-col space-y-1">
                    <span>Club Updates</span>
                    <span className="font-normal text-muted-foreground text-sm">
                      Notifications about club activities and announcements
                    </span>
                  </Label>
                  <Switch id="club-updates" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="event-reminders" className="flex flex-col space-y-1">
                    <span>Event Reminders</span>
                    <span className="font-normal text-muted-foreground text-sm">
                      Get notified before events you've RSVP'd to
                    </span>
                  </Label>
                  <Switch id="event-reminders" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="recruitment-updates" className="flex flex-col space-y-1">
                    <span>Recruitment Updates</span>
                    <span className="font-normal text-muted-foreground text-sm">
                      Notifications about application status and new opportunities
                    </span>
                  </Label>
                  <Switch id="recruitment-updates" defaultChecked />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="two-factor" className="flex flex-col space-y-1">
                    <span>Two-Factor Authentication</span>
                    <span className="font-normal text-muted-foreground text-sm">
                      Add an extra layer of security to your account
                    </span>
                  </Label>
                  <Switch id="two-factor" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>Update Security</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-md">
                  <h3 className="text-sm font-medium text-amber-800">Account Type: {user?.role === 'student' ? 'Student' : user?.role === 'clubRepresentative' ? 'Club Representative' : 'Administrator'}</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Your account permissions are based on your current role. Contact an administrator if you need to change your role.
                  </p>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Data & Privacy</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="data-collection" className="flex flex-col space-y-1">
                        <span>Data Collection</span>
                        <span className="font-normal text-muted-foreground text-sm">
                          Allow us to collect usage data to improve the platform
                        </span>
                      </Label>
                      <Switch id="data-collection" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2">Danger Zone</h3>
                  <div className="border border-red-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-red-700">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" size="sm">Delete Account</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
