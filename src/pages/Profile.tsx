
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StudentProfile from '@/components/profile/StudentProfile';
import ClubRepProfile from '@/components/profile/ClubRepProfile';
import AdminProfile from '@/components/profile/AdminProfile';

const Profile = () => {
  const { user } = useAuth();

  // Render the appropriate profile component based on user role
  const renderProfile = () => {
    switch (user?.role) {
      case 'student':
        return <StudentProfile />;
      case 'clubRepresentative':
        return <ClubRepProfile />;
      case 'admin':
        return <AdminProfile />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>
      
      {renderProfile()}
    </div>
  );
};

export default Profile;
