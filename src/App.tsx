
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
import MainLayout from './components/layout/MainLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminClubApprovals from './pages/admin/AdminClubApprovals';
import AdminOverview from './pages/admin/AdminOverview';
import ApplicationDetails from './pages/ApplicationDetails';

// Mock position data for ApplicationForm
const mockPosition = {
  id: "1",
  title: "Web Developer",
  club: "Programming Club",
  description: "Looking for experienced web developers to join our team",
  requirements: "HTML, CSS, JavaScript, React experience required",
  deadline: "2025-05-30"
};

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
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <Dashboard />
            }
          ]
        },
        {
          path: "/dashboard",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <Dashboard />
            }
          ]
        },
        {
          path: "/profile",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <Profile />
            }
          ]
        },
        {
          path: "/clubs",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <Clubs />
            }
          ]
        },
        {
          path: "/events",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <Events />
            }
          ]
        },
        {
          path: "/community",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <Community />
            }
          ]
        },
        {
          path: "/recruit",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <Recruitment />
            }
          ]
        },
        {
          path: "/recruitment/create",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <CreateRecruitment />
            }
          ]
        },
        {
          path: "/recruitment/:id",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <ApplicationForm position={mockPosition} />
            }
          ]
        },
        {
          path: "/admin/users",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <AdminUsers />
            }
          ]
        },
        {
          path: "/admin/club-approvals",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <AdminClubApprovals />
            }
          ]
        },
        {
          path: "/admin/overview",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <AdminOverview />
            }
          ]
        },
        {
          path: "/recruitment/:id/apply",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <ApplicationDetails />
            }
          ]
        },
      ])}
    />
  );
}

export default App;
