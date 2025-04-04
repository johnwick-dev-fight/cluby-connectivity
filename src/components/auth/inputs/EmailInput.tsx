
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface EmailInputProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({ 
  id = "email",
  value, 
  onChange,
  placeholder = "you@example.com",
  label = "Email"
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="dark:text-gray-300">{label}</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id={id}
          type="email"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="pl-9 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-cluby-500 focus:border-cluby-500"
          autoComplete="email"
        />
      </div>
    </div>
  );
};

export default EmailInput;
