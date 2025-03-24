import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/lib/mongodb/services/postService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CreatePostDialog from '@/components/community/CreatePostDialog';
import PostFilters from '@/components/community/PostFilters';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PostType {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image_url: string | null;
  club_id: string;
  author_id: string;
  post_type: string;
  club: {
    name: string;
    logo_url: string | null;
  };
  author: {
    full_name: string | null;
    avatar_url: string | null;
  } | null | { error: boolean };
  _count?: {
    likes: number;
    comments: number;
  };
}

interface PostFiltersProps {
  activeFilter: string;
  searchTerm: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
}

interface PostNotFoundProps {
  message: string;
}

const PostNotFound: React.FC<PostNotFoundProps> = ({ message }) => (
  <Alert variant="destructive" className="mb-6">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>No posts found</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const Community = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: posts, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['posts', activeFilter, searchTerm],
    queryFn: async () => {
      let query: any = {};
      
      if (activeFilter !== 'all') {
        if (activeFilter === 'following') {
          if (!user) {
            return [];
          }
          return [];
        } else if (activeFilter === 'events') {
          query.post_type = 'event';
        } else if (activeFilter === 'announcements') {
          query.post_type = 'announcement';
        }
      }
      
      const { data, error } = await getPosts(query);
      
      if (error) {
        throw error;
      }
      
      let filteredPosts = data || [];
      
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredPosts = filteredPosts.filter((post: PostType) => 
          post.title.toLowerCase().includes(lowerSearchTerm) || 
          post.content.toLowerCase().includes(lowerSearchTerm)
        );
      }
      
      const postsWithCounts = filteredPosts.map((post: PostType) => ({
        ...post,
        _count: {
          likes: 0,
          comments: 0
        }
      }));
      
      return postsWithCounts as PostType[];
    }
  });

  const handleFilterChange = (newFilter: string) => {
    setActiveFilter(newFilter);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
  };

  const handlePostSuccess = () => {
    setIsDialogOpen(false);
    refetch();
    toast({
      title: "Post created",
      description: "Your post has been published successfully!"
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest posts from college clubs
          </p>
        </div>
        
        {user && (
          <Button onClick={() => setIsDialogOpen(true)}>
            Create Post
          </Button>
        )}
      </div>

      <div className="mb-8">
        <PostFilters 
          activeFilter={activeFilter}
          searchTerm={searchTerm}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading posts...</span>
        </div>
      ) : isError ? (
        <div className="text-center py-10">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium">Error loading posts</h3>
          <p className="text-muted-foreground mt-2">{error?.message || "An unexpected error occurred"}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post: PostType) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={post.club.logo_url || ''} alt={post.club.name} />
                    <AvatarFallback>{post.club.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium leading-none">{post.club.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-4">{post.content}</p>
                
                {post.image_url && (
                  <div className="mb-4 overflow-hidden rounded-md">
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="w-full h-auto object-cover max-h-[400px]" 
                    />
                  </div>
                )}
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="mr-4">{post._count?.likes || 0} likes</span>
                  <span>{post._count?.comments || 0} comments</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <PostNotFound 
          message={
            searchTerm 
              ? `No posts found matching "${searchTerm}". Try a different search term.` 
              : activeFilter !== 'all' 
                ? `No posts found with the "${activeFilter}" filter.` 
                : "No posts found. Be the first to create a post!"
          } 
        />
      )}

      <CreatePostDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSuccess={handlePostSuccess}
      />
    </div>
  );
};

export default Community;
