
import React, { useState } from 'react';
import { InfoIcon } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const TestAccountsSection: React.FC = () => {
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  
  const handleTestAccountClick = () => {
    setShowTestAccounts(!showTestAccounts);
  };
  
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card dark:bg-gray-800 px-2 text-muted-foreground">
          Test Accounts
        </span>
      </div>
      
      <div className="text-sm text-center text-gray-500 dark:text-gray-400">
        <button
          type="button"
          onClick={handleTestAccountClick}
          className="inline-flex items-center text-primary hover:underline focus:outline-none"
        >
          {showTestAccounts ? "Hide test accounts" : "Show test accounts"}
          <InfoIcon className="ml-1 h-3.5 w-3.5" />
        </button>
        
        {showTestAccounts && (
          <div className="mt-2 bg-muted p-3 rounded-md text-left">
            <p className="mb-1 font-medium">For testing purposes, use:</p>
            <p>Student: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">student1@gmail.com</span> / <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">password123</span></p>
            <p>Club Rep: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">club_rep@gmail.com</span> / <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">password123</span></p>
            <p>Admin: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">admin@cluby.com</span> / <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">password123</span></p>
            <p className="mt-2 text-xs">To create a new account, please use the Register form.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAccountsSection;
