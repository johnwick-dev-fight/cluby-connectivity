
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: () => void;
  userClubs?: Array<{ id: string; name: string }>;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ 
  open, 
  onOpenChange,
  onPostCreated,
  userClubs = []
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('general');
  const [selectedClub, setSelectedClub] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and content for your post",
        variant: "destructive"
      });
      return;
    }
    
    if (user?.role === 'clubRepresentative' && !selectedClub) {
      toast({
        title: "Club selection required",
        description: "Please select a club to post as",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(`public/${fileName}`, imageFile);
          
        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`);
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(`public/${fileName}`);
          
        imageUrl = publicUrl;
      }
      
      // Create post
      const { error } = await supabase
        .from('posts')
        .insert({
          title,
          content,
          post_type: postType,
          author_id: user?.id,
          club_id: user?.role === 'clubRepresentative' ? selectedClub : null,
          image_url: imageUrl,
          is_flagged: false
        });
        
      if (error) {
        throw new Error(`Error creating post: ${error.message}`);
      }
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully"
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setPostType('general');
      setSelectedClub('');
      setImageFile(null);
      setImagePreview(null);
      
      // Close dialog and refresh posts
      onOpenChange(false);
      onPostCreated();
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Button onClick={() => onOpenChange(true)}>Create Post</Button>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Share an update, achievement, event, or opportunity with the community
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postType">Post Type</Label>
              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger id="postType">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  {user?.role === 'clubRepresentative' && (
                    <>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="job">Job Opening</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {user?.role === 'clubRepresentative' && userClubs.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="club">Post as Club</Label>
                <Select value={selectedClub} onValueChange={setSelectedClub}>
                  <SelectTrigger id="club">
                    <SelectValue placeholder="Select a club" />
                  </SelectTrigger>
                  <SelectContent>
                    {userClubs.map(club => (
                      <SelectItem key={club.id} value={club.id}>{club.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your post"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              className="min-h-[120px] resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Add an Image (Optional)</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
                className="gap-2"
              >
                <ImagePlus size={16} />
                Select Image
              </Button>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {imagePreview && <span className="text-sm text-green-600">Image selected</span>}
            </div>
            
            {imagePreview && (
              <div className="mt-2 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-32 rounded border object-contain"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  <X size={14} />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Post'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
