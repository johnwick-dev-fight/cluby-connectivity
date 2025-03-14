
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Settings,
  PlusCircle
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm",
      isActive 
        ? "bg-cluby-50 text-cluby-700 font-medium" 
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Define navigation items based on user role
  const navItems = [
    { to: "/dashboard", icon: <Home size={18} />, label: "Dashboard", roles: ['student', 'clubRepresentative', 'admin'] },
    { to: "/clubs", icon: <Users size={18} />, label: "Clubs", roles: ['student', 'clubRepresentative', 'admin'] },
    { to: "/recruit", icon: <Briefcase size={18} />, label: "Recruit", roles: ['student', 'clubRepresentative', 'admin'] },
    { to: "/community", icon: <MessageSquare size={18} />, label: "Community", roles: ['student', 'clubRepresentative', 'admin'] },
    { to: "/events", icon: <Calendar size={18} />, label: "Events", roles: ['student', 'clubRepresentative', 'admin'] },
  ];
  
  // Admin-specific items
  const adminItems = [
    { to: "/admin/dashboard", icon: <BarChart3 size={18} />, label: "Admin Panel", roles: ['admin'] },
    { to: "/admin/clubs", icon: <Users size={18} />, label: "Manage Clubs", roles: ['admin'] },
  ];
  
  // Club representative specific items
  const clubRepItems = [
    { to: "/club-management", icon: <PlusCircle size={18} />, label: "My Club", roles: ['clubRepresentative'] },
  ];
  
  // Common items at the bottom
  const bottomItems = [
    { to: "/settings", icon: <Settings size={18} />, label: "Settings", roles: ['student', 'clubRepresentative', 'admin'] },
  ];
  
  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role || ''));
  const filteredAdminItems = adminItems.filter(item => item.roles.includes(user?.role || ''));
  const filteredClubRepItems = clubRepItems.filter(item => item.roles.includes(user?.role || ''));
  
  return (
    <aside className="w-64 border-r bg-white hidden md:block p-4">
      <div className="space-y-1">
        {filteredNavItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.to}
          />
        ))}
      </div>
      
      {filteredClubRepItems.length > 0 && (
        <>
          <div className="my-4 px-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Club Management
            </h3>
          </div>
          <div className="space-y-1">
            {filteredClubRepItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.to}
              />
            ))}
          </div>
        </>
      )}
      
      {filteredAdminItems.length > 0 && (
        <>
          <div className="my-4 px-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administration
            </h3>
          </div>
          <div className="space-y-1">
            {filteredAdminItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.to}
              />
            ))}
          </div>
        </>
      )}
      
      <div className="pt-4 mt-4 border-t">
        <div className="space-y-1">
          {bottomItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
