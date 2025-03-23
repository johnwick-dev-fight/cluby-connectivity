
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          autoComplete="email"
        />
      </div>
    </div>
  );
};

export default EmailInput;
