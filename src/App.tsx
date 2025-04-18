import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Clubs from './pages/Clubs';
import Events from './pages/Events';
import Community from './pages/Community';
import Recruitment from './pages/Recruitment';
import CreateRecruitment from './pages/CreateRecruitment';
import ApplicationForm from './components/recruitment/ApplicationForm';
import MainLayout from './layouts/MainLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminClubApprovals from './pages/admin/AdminClubApprovals';
import AdminOverview from './pages/admin/AdminOverview';
import ApplicationDetails from './pages/ApplicationDetails';

function App() {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/auth",
          element: <Auth />,
        },
        {
          path: "/",
          element: (
            <MainLayout>
              <Dashboard />
            </MainLayout>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <MainLayout>
              <Dashboard />
            </MainLayout>
          ),
        },
        {
          path: "/profile",
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          ),
        },
        {
          path: "/clubs",
          element: (
            <MainLayout>
              <Clubs />
            </MainLayout>
          ),
        },
        {
          path: "/events",
          element: (
            <MainLayout>
              <Events />
            </MainLayout>
          ),
        },
        {
          path: "/community",
          element: (
            <MainLayout>
              <Community />
            </MainLayout>
          ),
        },
        {
          path: "/recruit",
          element: (
            <MainLayout>
              <Recruitment />
            </MainLayout>
          ),
        },
        {
          path: "/recruitment/create",
          element: (
            <MainLayout>
              <CreateRecruitment />
            </MainLayout>
          ),
        },
        {
          path: "/recruitment/:id",
          element: (
            <MainLayout>
              <ApplicationForm />
            </MainLayout>
          ),
        },
        {
          path: "/admin/users",
          element: (
            <MainLayout>
              <AdminUsers />
            </MainLayout>
          ),
        },
        {
          path: "/admin/club-approvals",
          element: (
            <MainLayout>
              <AdminClubApprovals />
            </MainLayout>
          ),
        },
        {
          path: "/admin/overview",
          element: (
            <MainLayout>
              <AdminOverview />
            </MainLayout>
          ),
        },
        {
          path: "/recruitment/:id/apply",
          element: (
            <MainLayout>
              <ApplicationDetails />
            </MainLayout>
          ),
        },
      ])}
    />
  );
}

export default App;
