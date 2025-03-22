
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
  ShieldAlert,
  Bell,
  HelpCircle,
  FileText,
  Heart,
  Award,
  ClipboardList,
  UserPlus,
  BarChart3,
  AlertTriangle,
  Megaphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  
  // Common navigation items for all users
  const commonNavItems = [
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
  
  // Student-specific navigation items
  const studentNavItems = [
    { 
      name: 'Recruit', 
      path: '/recruit', 
      icon: <Briefcase size={20} /> 
    }
  ];
  
  // Club Representative-specific navigation items
  const clubRepNavItems = [
    { 
      name: 'Recruit', 
      path: '/recruit', 
      icon: <Briefcase size={20} /> 
    },
    { 
      name: 'Create Position', 
      path: '/recruit/create', 
      icon: <ClipboardList size={20} /> 
    },
    { 
      name: 'Members', 
      path: '/club-members', 
      icon: <UserPlus size={20} /> 
    }
  ];
  
  // Admin-only navigation items
  const adminNavItems = [
    { 
      name: 'Platform Overview', 
      path: '/admin/overview', 
      icon: <BarChart3 size={20} /> 
    },
    { 
      name: 'User Management', 
      path: '/admin/users', 
      icon: <Users size={20} /> 
    },
    { 
      name: 'Club Approvals', 
      path: '/admin/club-approvals', 
      icon: <Award size={20} /> 
    },
    { 
      name: 'Event Management', 
      path: '/admin/events', 
      icon: <Calendar size={20} /> 
    },
    { 
      name: 'Community Moderation', 
      path: '/admin/community', 
      icon: <Megaphone size={20} /> 
    }
  ];

  // Get role-specific nav items
  const getRoleSpecificNavItems = () => {
    if (!user) return [...commonNavItems];
    
    switch(user.role) {
      case 'admin':
        return [...commonNavItems];
      case 'clubRepresentative':
        return [...commonNavItems, ...clubRepNavItems];
      case 'student':
      default:
        return [...commonNavItems, ...studentNavItems];
    }
  };

  const navItems = getRoleSpecificNavItems();
  
  return (
    <aside className="w-64 hidden md:block border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)] overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200",
                isActive
                  ? "bg-cluby-50 text-cluby-600 dark:bg-gray-800 dark:text-cluby-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
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
                  Administration
                </p>
              </div>
              
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200",
                    isActive
                      ? "bg-cluby-50 text-cluby-600 dark:bg-gray-800 dark:text-cluby-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
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
