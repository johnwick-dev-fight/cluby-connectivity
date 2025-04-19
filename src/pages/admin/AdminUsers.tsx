
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Edit, Trash2, ShieldAlert, ShieldCheck } from 'lucide-react';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock user data - in a real app, this would come from an API
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'student', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'club_rep', status: 'active' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'admin', status: 'active' },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'student', status: 'inactive' },
  ];
  
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Admin</Badge>;
      case 'club_rep':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Club Rep</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800 border-green-200">Student</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage all users on the platform</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="search" 
            placeholder="Search users..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.status === 'active' ? 
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge> : 
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.role !== 'admin' ? (
                        <Button variant="ghost" size="icon">
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon">
                          <ShieldAlert className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
