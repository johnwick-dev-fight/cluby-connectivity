
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createPost } from '@/lib/mongodb/services/postService';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const { user } = useAuth();
  const [postType, setPostType] = useState('general');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [clubId, setClubId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for clubs when in browser environment
  const MOCK_CLUBS = [
    { id: '1', name: 'Programming Club' },
    { id: '2', name: 'Photography Club' }
  ];

  // Fetch user's clubs (or use mock data in browser)
  const { data: userClubs, isLoading: isLoadingClubs } = useQuery({
    queryKey: ['userClubs'],
    queryFn: async () => {
      if (!user) return [];
      
      // In browser environment, return mock data
      if (typeof window !== 'undefined') {
        return MOCK_CLUBS;
      }
      
      // Server logic would go here
      return [];
    },
    enabled: !!user
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !clubId) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await createPost({
        title,
        content,
        club_id: clubId,
        author_id: user?.id || 'mock-user-id',
        post_type: postType,
      });
      
      if (error) throw new Error(error);
      
      // Reset form
      setTitle('');
      setContent('');
      setPostType('general');
      
      // Close dialog and notify success
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error creating post',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>
              Share an update, event, or announcement with your community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="club" className="text-right">
                Club
              </Label>
              <Select 
                value={clubId} 
                onValueChange={setClubId}
                disabled={isLoadingClubs}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a club" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingClubs ? (
                    <SelectItem value="loading" disabled>
                      Loading clubs...
                    </SelectItem>
                  ) : userClubs && userClubs.length > 0 ? (
                    userClubs.map((club: { id: string, name: string }) => (
                      <SelectItem key={club.id} value={club.id}>
                        {club.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No clubs available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Post Type
              </Label>
              <Select 
                value={postType} 
                onValueChange={setPostType}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Post type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3"
                rows={6}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
