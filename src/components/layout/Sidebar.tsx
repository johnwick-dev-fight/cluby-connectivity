
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Briefcase, 
  Settings, 
  UserCircle, 
  Calendar,
  ShieldAlert 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: 'Clubs', 
      path: '/clubs', 
      icon: <Users size={20} /> 
    },
    { 
      name: 'Events', 
      path: '/events', 
      icon: <Calendar size={20} /> 
    },
    { 
      name: 'Community', 
      path: '/community', 
      icon: <MessageSquare size={20} /> 
    },
    { 
      name: 'Recruit', 
      path: '/recruit', 
      icon: <Briefcase size={20} /> 
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <UserCircle size={20} /> 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings size={20} /> 
    }
  ];
  
  // Admin-only items
  const adminItems = [
    { 
      name: 'Club Approvals', 
      path: '/admin/club-approvals', 
      icon: <ShieldAlert size={20} /> 
    }
  ];
  
  return (
    <aside className="w-64 hidden md:block border-r dark:border-gray-800 h-[calc(100vh-4rem)] overflow-y-auto bg-white dark:bg-gray-900">
      <div className="py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                isActive
                  ? "bg-cluby-50 text-cluby-600 dark:bg-gray-800 dark:text-cluby-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
          
          {user?.role === 'admin' && (
            <>
              <div className="pt-5 pb-2">
                <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Admin
                </p>
              </div>
              
              {adminItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-cluby-50 text-cluby-600 dark:bg-gray-800 dark:text-cluby-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
