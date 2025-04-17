
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SeedDatabase = () => {
  const handleSeed = async () => {
    try {
      const response = await fetch('/api/seed-database');
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Database seeded with ${data.data.clubs} clubs, ${data.data.events} events, and ${data.data.posts} posts.`
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to seed database"
      });
    }
  };

  return (
    <Button 
      onClick={handleSeed}
      variant="outline"
      className="gap-2"
    >
      Seed Database
    </Button>
  );
};

export default SeedDatabase;
