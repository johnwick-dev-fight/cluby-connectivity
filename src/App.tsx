
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import MainLayout from "@/components/layout/MainLayout";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Clubs from "@/pages/Clubs";
import ClubDetail from "@/pages/ClubDetail";
import Community from "@/pages/Community";
import Recruitment from "@/pages/Recruitment";
import CreateRecruitment from "@/pages/CreateRecruitment";
import Events from "@/pages/Events";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import ClubApprovals from "@/pages/admin/ClubApprovals";
import UserManagement from "@/pages/admin/UserManagement";
import EventManagement from "@/pages/admin/EventManagement";
import CommunityManagement from "@/pages/admin/CommunityManagement";
import AdminOverview from "@/pages/admin/Overview";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60 * 1000,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }
  
  // If no user is logged in, redirect to auth
  if (!user) {
    console.log("Protected route: User not authenticated, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }
  
  // If roles are specified and user role doesn't match, redirect to dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(`Protected route: User role '${user.role}' not allowed, redirecting to dashboard`);
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes inside MainLayout */}
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="clubs" element={<Clubs />} />
                <Route path="clubs/:id" element={<ClubDetail />} />
                <Route path="community" element={<Community />} />
                <Route path="events" element={<Events />} />
                <Route path="recruit" element={<Recruitment />} />
                <Route path="recruit/create" element={
                  <ProtectedRoute allowedRoles={['clubRepresentative', 'admin']}>
                    <CreateRecruitment />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                
                {/* Admin routes */}
                <Route path="admin/club-approvals" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ClubApprovals />
                  </ProtectedRoute>
                } />
                <Route path="admin/overview" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminOverview />
                  </ProtectedRoute>
                } />
                <Route path="admin/users" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                } />
                <Route path="admin/events" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <EventManagement />
                  </ProtectedRoute>
                } />
                <Route path="admin/community" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <CommunityManagement />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
