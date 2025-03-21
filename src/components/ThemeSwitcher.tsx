
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ThemeSwitcherProps {
  variant?: 'icon' | 'switch' | 'full';
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  variant = 'icon',
  className = '' 
}) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'switch') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Switch 
          checked={theme === 'dark'} 
          onCheckedChange={toggleTheme} 
          aria-label="Toggle theme"
        />
        <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleTheme} 
        className={`gap-2 ${className}`}
      >
        {theme === 'dark' ? (
          <>
            <Sun className="h-4 w-4" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4" />
            <span>Dark Mode</span>
          </>
        )}
      </Button>
    );
  }

  // Default icon variant
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      className={`rounded-full ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ThemeSwitcher;
