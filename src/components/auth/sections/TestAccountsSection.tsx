
import React, { useState } from 'react';
import { InfoIcon, Copy } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const TestAccountsSection: React.FC = () => {
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  
  const handleTestAccountClick = () => {
    setShowTestAccounts(!showTestAccounts);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copied to clipboard",
      duration: 2000,
    });
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-50 dark:bg-gray-900 px-2 text-muted-foreground">
            Test Accounts
          </span>
        </div>
      </div>
      
      <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-3">
        <button
          type="button"
          onClick={handleTestAccountClick}
          className="inline-flex items-center text-primary hover:underline focus:outline-none"
        >
          {showTestAccounts ? "Hide test accounts" : "Show test accounts"}
          <InfoIcon className="ml-1 h-3.5 w-3.5" />
        </button>
        
        {showTestAccounts && (
          <div className="mt-3 bg-white dark:bg-gray-800 p-3 rounded-md text-left border border-gray-200 dark:border-gray-700">
            <p className="mb-2 font-medium">For testing purposes, use:</p>
            
            <div className="space-y-2">
              <div className="p-2 rounded bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-xs">Student</span><br />
                  <span className="font-mono text-xs">student1@gmail.com / password123</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => copyToClipboard("student1@gmail.com")}
                  className="h-8 w-8"
                >
                  <Copy size={14} />
                </Button>
              </div>
              
              <div className="p-2 rounded bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-xs">Club Representative</span><br />
                  <span className="font-mono text-xs">club_rep@gmail.com / password123</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => copyToClipboard("club_rep@gmail.com")}
                  className="h-8 w-8"
                >
                  <Copy size={14} />
                </Button>
              </div>
              
              <div className="p-2 rounded bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-xs">Admin</span><br />
                  <span className="font-mono text-xs">admin@cluby.com / password123</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => copyToClipboard("admin@cluby.com")}
                  className="h-8 w-8"
                >
                  <Copy size={14} />
                </Button>
              </div>
            </div>
            
            <p className="mt-3 text-xs">To create a new account, please use the Register form.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAccountsSection;
