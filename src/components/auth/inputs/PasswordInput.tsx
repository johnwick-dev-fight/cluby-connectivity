
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showForgotPassword?: boolean;
  onForgotPasswordClick?: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder = "••••••••",
  showForgotPassword = false,
  onForgotPasswordClick
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={id} className="dark:text-gray-300">{label}</Label>
        {showForgotPassword && (
          <Button variant="link" size="sm" className="px-0 text-cluby-600 dark:text-cluby-400" onClick={onForgotPasswordClick}>
            Forgot password?
          </Button>
        )}
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="pl-9 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          autoComplete={id === "password" ? "current-password" : undefined}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-10 w-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={toggleShowPassword}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default PasswordInput;
