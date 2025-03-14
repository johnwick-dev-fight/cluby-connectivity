
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StudentProfile from '@/components/profile/StudentProfile';
import ClubRepProfile from '@/components/profile/ClubRepProfile';
import AdminProfile from '@/components/profile/AdminProfile';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  // Render the appropriate profile component based on user role
  const renderProfile = () => {
    switch (user.role) {
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
