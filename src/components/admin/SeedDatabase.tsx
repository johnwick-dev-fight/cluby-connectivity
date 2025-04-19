
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const SeedDatabase = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSeed = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/seed-database/route');
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Database Seeded Successfully",
          description: `Added ${data.data.clubs} clubs, ${data.data.events} events, and ${data.data.posts} posts.`,
        });
      } else {
        throw new Error(data.message || 'Failed to seed database');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to seed database"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSeed}
      variant="outline"
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading ? 'Seeding Database...' : 'Seed Database'}
    </Button>
  );
};

export default SeedDatabase;
