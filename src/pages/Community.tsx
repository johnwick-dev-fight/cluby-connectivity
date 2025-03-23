
import React, { useEffect, useState } from 'react';
import { useQuery, RefetchOptions, QueryObserverResult } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare, ThumbsUp, User, CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

// Create new components for better organization
import PostNotFound from '@/components/errors/PostNotFound';
import PostFilters from '@/components/community/PostFilters';
import CreatePostDialog from '@/components/community/CreatePostDialog';

// Helper function to fetch post author and club details
const fetchPostMetadata = async (postData: any[]) => {
  if (!postData || postData.length === 0) return [];
  
  // Get unique user IDs and club IDs from posts
  const userIds = [...new Set(postData.map(post => post.author_id))];
  const clubIds = [...new Set(postData.filter(post => post.club_id).map(post => post.club_id))];
  
  // Fetch user profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', userIds);
  
  // Fetch clubs
  const { data: clubs } = await supabase
    .from('clubs')
    .select('id, name, logo_url')
    .in('id', clubIds);
  
  // Map profiles and clubs to posts
  return postData.map(post => {
    const author = profiles?.find(profile => profile.id === post.author_id);
    const club = post.club_id ? clubs?.find(club => club.id === post.club_id) : null;
    
    return {
      ...post,
      author: author || { full_name: 'Unknown User' },
      club: club || null
    };
  });
};

const Community = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  
  // Post fetching query
  const {
    data: posts,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['community-posts', filter, search],
    queryFn: async () => {
      console.log('Fetching posts with filter:', filter, 'and search:', search);
      
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (filter === 'clubs' && user) {
        // We need to check club memberships instead, since club_followers doesn't exist
        const { data: memberships } = await supabase
          .from('club_members')
          .select('club_id')
          .eq('user_id', user.id);
        
        if (memberships && memberships.length > 0) {
          const clubIds = memberships.map(member => member.club_id);
          query = query.in('club_id', clubIds);
        } else {
          // If user doesn't belong to any clubs, return empty array
          return [];
        }
      } else if (filter === 'events') {
        query = query.eq('post_type', 'event');
      } else if (filter === 'announcements') {
        query = query.eq('post_type', 'announcement');
      }
      
      // Apply search if provided
      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching posts:', error);
        throw new Error(error.message);
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Fetch additional metadata (author, club)
      return await fetchPostMetadata(data);
    },
    staleTime: 60 * 1000, // 1 minute
  });

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };
  
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };
  
  const handleRefetch = () => {
    refetch();
  };
  
  const renderPostContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-md">
              <CardHeader>
                <CardTitle><Skeleton className="h-5 w-4/5" /></CardTitle>
                <CardDescription><Skeleton className="h-4 w-3/5" /></CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
                <div className="mt-4 flex justify-between items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    
    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Failed to load posts</h3>
            <p className="text-muted-foreground mb-4">Please try again.</p>
          </div>
          <Button onClick={handleRefetch} className="mt-4">
            Retry
          </Button>
        </div>
      );
    }
    
    if (!posts || posts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground">No posts found with the current filters.</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="shadow-md">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>{post.content.substring(0, 100)}...</p>
              {post.club && (
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    {post.club.logo_url ? (
                      <AvatarImage src={post.club.logo_url} alt={post.club.name} />
                    ) : (
                      <AvatarFallback>{post.club.name.substring(0, 2)}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm font-medium leading-none">{post.club.name}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{post.author?.full_name || 'Unknown User'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm">
                  {format(new Date(post.created_at), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {format(new Date(post.created_at), 'hh:mm a')}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" /> Like
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" /> Comment
                </Button>
              </div>
              {post.post_type && (
                <Badge variant="secondary">{post.post_type}</Badge>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const handlePostCreated = () => {
    toast({
      title: "Post created",
      description: "Your post has been created successfully",
    });
    refetch();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Community</h1>
        <CreatePostDialog open={false} onOpenChange={() => {}} onPostCreated={handlePostCreated} />
      </div>
      <PostFilters 
        filters={{ search: search, postType: filter, author: '', tags: [] }}
        onFilterChange={(key, value) => {
          if (key === 'search') handleSearchChange(value);
          if (key === 'postType') handleFilterChange(value);
        }}
        onClearFilters={() => {
          setSearch('');
          setFilter('all');
        }}
        userRole={user?.role as 'student' | 'clubRepresentative' | 'admin' || 'student'}
      />
      <div className="mt-6">
        {renderPostContent()}
      </div>
    </div>
  );
};

export default Community;
