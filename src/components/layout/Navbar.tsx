
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { getInitials } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b bg-background">
      <div className="cluby-container flex justify-between items-center py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold text-primary">
            Cluby
          </Link>
          
          <div className="hidden md:flex relative w-96 max-w-sm">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              type="search" 
              placeholder="Search clubs, events..." 
              className="pl-8 w-full"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage src="/avatar-placeholder.jpg" alt={user?.profile?.full_name || 'User avatar'} />
                  <AvatarFallback>{user ? getInitials(user.profile?.full_name || user.email) : '??'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.profile?.full_name || user?.email || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || 'No email'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/dashboard" className="w-full">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="w-full">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
