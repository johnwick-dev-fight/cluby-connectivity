
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Check, X, AlertTriangle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Types for our posts data with UI state
interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  club_id: string;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  ui_status?: 'pending' | 'approved' | 'rejected'; // For UI state only
  club?: {
    name: string;
    logo_url: string | null;
  };
  profile?: {
    full_name: string;
    avatar_url: string | null;
  };
}

const CommunityManagement = () => {
  const queryClient = useQueryClient();
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  
  // Fetch posts with club and profile information
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          club:club_id(name, logo_url),
          profile:author_id(full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Post[];
    },
  });

  // Mutation for approving/rejecting posts (this would be implemented if we had status column)
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, ui_status }: { id: string; ui_status: 'approved' | 'rejected' }) => {
      // In a real application with a status column in the posts table:
      // const { error } = await supabase
      //   .from('posts')
      //   .update({ status: status })
      //   .eq('id', id);
      //
      // if (error) throw error;
      
      // Since we don't have a status column, we'll simulate it for UI purposes
      return { id, ui_status };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-posts'], (oldData: Post[] | undefined) => 
        oldData?.map(post => 
          post.id === data.id 
            ? { ...post, ui_status: data.ui_status } 
            : post
        )
      );
      
      toast({
        title: `Post ${data.ui_status}`,
        description: `The post has been ${data.ui_status} successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Action failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(['admin-posts'], (oldData: Post[] | undefined) => 
        oldData?.filter(post => post.id !== id)
      );
      
      toast({
        title: "Post deleted",
        description: "The post has been permanently deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community Management</h1>
        <p className="text-muted-foreground">Review and moderate posts in the community</p>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Posts</TabsTrigger>
          <TabsTrigger value="reported">Reported</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Posts</CardTitle>
              <CardDescription>
                View and manage all posts in the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of all posts in the system</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Club</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts && posts.length > 0 ? (
                    posts.map((post) => (
                      <React.Fragment key={post.id}>
                        <TableRow>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={post.club?.logo_url || ''} alt={post.club?.name} />
                                <AvatarFallback>{post.club?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span>{post.club?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{post.title}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePostExpansion(post.id)}
                                className="p-0 h-6 w-6"
                              >
                                {expandedPosts[post.id] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={post.profile?.avatar_url || ''} alt={post.profile?.full_name} />
                                <AvatarFallback>{post.profile?.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span>{post.profile?.full_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(post.created_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {post.ui_status ? (
                                <Badge 
                                  variant={
                                    post.ui_status === 'approved' 
                                      ? 'success' 
                                      : post.ui_status === 'rejected' 
                                        ? 'destructive' 
                                        : 'outline'
                                  }
                                >
                                  {post.ui_status.charAt(0).toUpperCase() + post.ui_status.slice(1)}
                                </Badge>
                              ) : (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updatePostMutation.mutate({ id: post.id, ui_status: 'approved' })}
                                    className="h-8 text-green-600 border-green-600 hover:bg-green-50"
                                  >
                                    <Check className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => deletePostMutation.mutate(post.id)}
                                    className="h-8 text-red-600 border-red-600 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4 mr-1" /> Delete
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {expandedPosts[post.id] && (
                          <TableRow className="bg-gray-50 dark:bg-gray-800">
                            <TableCell colSpan={5}>
                              <div className="space-y-4 p-4">
                                {post.image_url && (
                                  <div>
                                    <img 
                                      src={post.image_url} 
                                      alt={post.title} 
                                      className="rounded-md max-h-80 object-contain" 
                                    />
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-medium">Content:</h4>
                                  <p className="whitespace-pre-line text-sm">{post.content}</p>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <AlertTriangle className="h-12 w-12 mb-2" />
                          <h3 className="text-lg font-medium">No posts found</h3>
                          <p>There are no posts in the system yet.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="flagged">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Posts</CardTitle>
              <CardDescription>Posts that have been flagged for review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mb-2" />
                <h3 className="text-lg font-medium">No flagged posts</h3>
                <p>There are no posts that have been flagged for review.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reported">
          <Card>
            <CardHeader>
              <CardTitle>Reported Posts</CardTitle>
              <CardDescription>Posts that have been reported by users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mb-2" />
                <h3 className="text-lg font-medium">No reported posts</h3>
                <p>There are no posts that have been reported by users.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityManagement;
