
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface ClubFormProps {
  isEditing?: boolean;
  clubData?: {
    id?: string;
    name: string;
    description: string;
    category: string;
    foundedYear: string;
    email: string;
    website: string;
    socialMedia: {
      instagram?: string;
      twitter?: string;
      facebook?: string;
    }
  }
}

const ClubForm = ({ isEditing = false, clubData }: ClubFormProps) => {
  const navigate = useNavigate();
  
  const defaultData = clubData || {
    name: '',
    description: '',
    category: '',
    foundedYear: '',
    email: '',
    website: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: ''
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would submit to an API
    toast({
      title: isEditing ? "Club updated" : "Club submitted for approval",
      description: isEditing 
        ? "Your club details have been updated successfully." 
        : "Your club has been submitted and is pending admin approval.",
    });
    
    // Redirect after submission
    if (!isEditing) {
      navigate('/dashboard');
    }
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Club' : 'Register a New Club'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="club-name">Club Name *</Label>
            <Input id="club-name" placeholder="e.g. Programming Club" defaultValue={defaultData.name} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="club-description">Description *</Label>
            <Textarea 
              id="club-description" 
              placeholder="Describe your club's mission, activities, and goals..." 
              rows={4}
              defaultValue={defaultData.description}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="club-category">Category *</Label>
              <Input 
                id="club-category" 
                placeholder="e.g. Technology, Sports, Arts" 
                defaultValue={defaultData.category}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="club-founded">Founded Year</Label>
              <Input 
                id="club-founded" 
                placeholder="e.g. 2020" 
                defaultValue={defaultData.foundedYear}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="club-email">Contact Email *</Label>
            <Input 
              id="club-email" 
              type="email" 
              placeholder="club@example.com" 
              defaultValue={defaultData.email}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="club-website">Website</Label>
            <Input 
              id="club-website" 
              type="url" 
              placeholder="https://yourclub.com" 
              defaultValue={defaultData.website}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Social Media</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                placeholder="Instagram" 
                defaultValue={defaultData.socialMedia.instagram}
              />
              <Input 
                placeholder="Twitter" 
                defaultValue={defaultData.socialMedia.twitter}
              />
              <Input 
                placeholder="Facebook" 
                defaultValue={defaultData.socialMedia.facebook}
              />
            </div>
          </div>
          
          <div className="rounded-md bg-blue-50 p-4">
            <p className="text-sm text-blue-700">
              {isEditing 
                ? "Your changes will be visible to all users immediately after saving." 
                : "Your club registration will be reviewed by an administrator before being published."}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Save Changes' : 'Submit for Approval'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ClubForm;
