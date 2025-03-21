
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Search, Filter, Loader2, MessageSquare, UserCircle, Calendar, ThumbsUp, MessageCircle, Flag, Eye, XCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

// Types for post data
interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  author_id: string;
  club_id: string;
  created_at: string;
  updated_at: string;
  status?: string;
  reported?: boolean;
  author?: {
    full_name: string;
    avatar_url: string | null;
  };
  club?: {
    name: string;
  };
  _count?: {
    comments: number;
    likes: number;
  };
}

const CommunityManagement = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [moderationReason, setModerationReason] = useState('');
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'delete' | null>(null);

  // Query to fetch posts with author and club data
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:author_id(full_name, avatar_url),
          club:club_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching posts",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Mock data for comments and likes count
      return data.map((post: any) => ({
        ...post,
        _count: {
          comments: Math.floor(Math.random() * 20),
          likes: Math.floor(Math.random() * 50),
        },
        // Mock reported status for some posts
        reported: Math.random() > 0.7,
        // Mock status for posts
        status: Math.random() > 0.3 ? 'approved' : (Math.random() > 0.5 ? 'pending' : 'rejected'),
      })) as Post[];
    },
  });

  // Mutation to approve a post
  const approvePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('posts')
        .update({ status: 'approved' })
        .eq('id', postId);
      
      if (error) throw error;
      return postId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast({
        title: "Post approved",
        description: "The post has been published to the community.",
      });
      setIsPostDialogOpen(false);
      setConfirmAction(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to approve post",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Mutation to reject a post
  const rejectPostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('posts')
        .update({ 
          status: 'rejected',
          moderation_notes: moderationReason
        })
        .eq('id', postId);
      
      if (error) throw error;
      return postId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast({
        title: "Post rejected",
        description: "The post has been rejected and won't be visible in the community.",
      });
      setModerationReason('');
      setIsPostDialogOpen(false);
      setConfirmAction(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to reject post",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Mutation to delete a post
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      return postId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast({
        title: "Post deleted",
        description: "The post has been permanently deleted.",
      });
      setIsPostDialogOpen(false);
      setConfirmAction(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete post",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Filter posts based on search and active tab
  const filteredPosts = posts?.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.club?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && post.status === 'pending';
    if (activeTab === 'reported') return matchesSearch && post.reported;
    if (activeTab === 'approved') return matchesSearch && post.status === 'approved';
    
    return matchesSearch;
  });

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
    setIsPostDialogOpen(true);
  };

  // Confirm action handler
  const handleConfirmAction = () => {
    if (!selectedPost) return;
    
    if (confirmAction === 'approve') {
      approvePostMutation.mutate(selectedPost.id);
    } else if (confirmAction === 'reject') {
      rejectPostMutation.mutate(selectedPost.id);
    } else if (confirmAction === 'delete') {
      deletePostMutation.mutate(selectedPost.id);
    }
  };

  // Function to get status badge
  const getStatusBadge = (post: Post) => {
    if (post.reported) {
      return <Badge className="bg-red-100 text-red-800 border-red-300">Reported</Badge>;
    }
    
    switch(post.status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community Management</h1>
        <p className="text-muted-foreground">Moderate and manage community posts</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="sm:w-auto w-full">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="reported">Reported</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts && filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{post.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span>By {post.author?.full_name || 'Unknown'}</span>
                            <span>•</span>
                            <span>From {post.club?.name || 'Unknown Club'}</span>
                          </CardDescription>
                        </div>
                        {getStatusBadge(post)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(post.created_at), 'PPP')}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {post._count?.likes || 0}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post._count?.comments || 0}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewPost(post)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-10">
                    <div className="text-center text-muted-foreground">
                      No posts found matching your criteria
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Post Review Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPost.title}</DialogTitle>
                <DialogDescription>
                  Posted by {selectedPost.author?.full_name || 'Unknown'} from {selectedPost.club?.name || 'Unknown Club'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-2">
                {selectedPost.image_url && (
                  <div className="w-full h-48 rounded-md overflow-hidden">
                    <img 
                      src={selectedPost.image_url} 
                      alt={selectedPost.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {selectedPost.author?.avatar_url ? (
                      <img 
                        src={selectedPost.author.avatar_url} 
                        alt={selectedPost.author.full_name} 
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <UserCircle className="h-8 w-8 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{selectedPost.author?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(selectedPost.created_at), 'PPP p')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm whitespace-pre-line">
                    {selectedPost.content}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {selectedPost._count?.likes || 0} likes
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {selectedPost._count?.comments || 0} comments
                  </div>
                </div>
                
                {selectedPost.reported && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
                    <Flag className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-red-800">This post has been reported</p>
                      <p className="text-xs text-red-700">Reason: Contains inappropriate content</p>
                    </div>
                  </div>
                )}
                
                {selectedPost.status !== 'approved' && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Moderation Reason (Optional)</h4>
                    <Textarea
                      placeholder="Provide a reason for rejecting or removing this post..."
                      value={moderationReason}
                      onChange={(e) => setModerationReason(e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPostDialogOpen(false)}
                >
                  Cancel
                </Button>
                {selectedPost.status === 'approved' ? (
                  <Button 
                    variant="destructive"
                    onClick={() => setConfirmAction('delete')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Delete Post
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="destructive"
                      onClick={() => setConfirmAction('reject')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setConfirmAction('approve')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {confirmAction === 'approve' && "Approve Post"}
                {confirmAction === 'reject' && "Reject Post"}
                {confirmAction === 'delete' && "Delete Post"}
              </DialogTitle>
              <DialogDescription>
                {confirmAction === 'approve' && "This post will be published to the community."}
                {confirmAction === 'reject' && "This post will be rejected and not visible in the community."}
                {confirmAction === 'delete' && "This post will be permanently deleted."}
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </Button>
              <Button 
                variant={confirmAction === 'approve' ? "default" : "destructive"}
                onClick={handleConfirmAction}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CommunityManagement;
