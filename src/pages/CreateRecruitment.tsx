
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const CreateRecruitment = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would submit to an API
    toast({
      title: "Position created",
      description: "Your recruitment position has been created and is now visible to students.",
    });
    
    // Redirect after submission
    navigate('/recruit');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Recruitment Position</h1>
        <p className="text-muted-foreground">Post a new position to recruit members for your club</p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Position Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="position-title">Position Title *</Label>
              <Input id="position-title" placeholder="e.g. Web Developer, Event Coordinator" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position-description">Description *</Label>
              <Textarea 
                id="position-description" 
                placeholder="Describe the role, responsibilities, and what the candidate will be doing..." 
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position-requirements">Requirements *</Label>
              <Textarea 
                id="position-requirements" 
                placeholder="List the skills, experience, or qualifications needed for this position..." 
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position-type">Position Type *</Label>
                <Select defaultValue="volunteer">
                  <SelectTrigger id="position-type">
                    <SelectValue placeholder="Select position type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="partTime">Part-time</SelectItem>
                    <SelectItem value="committee">Committee Member</SelectItem>
                    <SelectItem value="leadership">Leadership Role</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position-deadline">Application Deadline *</Label>
                <Input 
                  id="position-deadline" 
                  type="date" 
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position-tags">Tags (comma separated) *</Label>
              <Input 
                id="position-tags" 
                placeholder="e.g. Technology, Web Development, Design" 
                required
              />
              <p className="text-xs text-muted-foreground">
                Add tags to help students find your position when searching
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position-vacancies">Number of Vacancies *</Label>
              <Input 
                id="position-vacancies" 
                type="number" 
                min="1"
                placeholder="e.g. 2" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position-contact">Contact Email for Inquiries *</Label>
              <Input 
                id="position-contact" 
                type="email" 
                placeholder="contact@example.com" 
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Position
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateRecruitment;
