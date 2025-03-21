
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, MessageSquare, Share2, Send, Image, Smile, PlusCircle, 
  Flag, Trash2, MoreVertical, AlertTriangle, Calendar, Briefcase, Award, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import CreatePostDialog from '@/components/community/CreatePostDialog';
import PostFilters from '@/components/community/PostFilters';

interface Post {
  id: string;
  title: string;
  content: string;
  post_type: 'general' | 'event' | 'job' | 'achievement';
  created_at: string;
  author_id: string;
  club_id: string | null;
  image_url: string | null;
  is_flagged: boolean;
  likes: number;
  comments: number;
  author: {
    full_name: string;
    avatar_url: string | null;
    role: string;
  };
  club?: {
    name: string;
    logo_url: string | null;
  };
  isLiked?: boolean;
}

interface PostMetadata {
  likes: number;
  is_liked: boolean;
  comments: number;
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userClubs, setUserClubs] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [flagAlertOpen, setFlagAlertOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    postType: '',
    author: '',
    tags: [] as string[],
  });
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      // Base query
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:author_id(
            id,
            full_name,
            avatar_url,
            role
          ),
          club:club_id(
            id,
            name,
            logo_url
          )
        `)
        .order('created_at', { ascending: false });
      
      // Apply search filter if provided
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }
      
      // Apply post type filter if provided
      if (filters.postType) {
        query = query.eq('post_type', filters.postType);
      }
      
      // Filter by author type
      if (filters.author === 'students') {
        query = query.eq('club_id', null);
      } else if (filters.author === 'clubs') {
        query = query.not('club_id', 'is', null);
      } else if (filters.author === 'following' && user) {
        // Get clubs that the user follows
        const { data: followedClubs } = await supabase
          .from('club_members')
          .select('club_id')
          .eq('user_id', user.id)
          .eq('status', 'approved');
          
        const clubIds = followedClubs?.map(item => item.club_id) || [];
        if (clubIds.length > 0) {
          query = query.in('club_id', clubIds);
        } else {
          // If user doesn't follow any clubs, return no posts
          query = query.eq('id', '-1');
        }
      }
      
      // Show or hide flagged posts based on user role
      if (user?.role !== 'admin') {
        query = query.eq('is_flagged', false);
      } else if (filters.postType === 'flagged') {
        query = query.eq('is_flagged', true);
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }

      if (data) {
        // Fetch metadata for each post (likes, comments)
        const postsWithMetadata = await Promise.all(
          data.map(async (post) => {
            const metadata = await fetchPostMetadata(post.id);
            return {
              ...post,
              likes: metadata.likes,
              comments: metadata.comments,
              isLiked: metadata.is_liked,
            } as Post;
          })
        );
        
        setPosts(postsWithMetadata);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchPostMetadata = async (postId: string): Promise<PostMetadata> => {
    try {
      // Count likes
      const { count: likesCount, error: likesError } = await supabase
        .from('post_likes')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', postId);
        
      // Check if user liked the post
      const { data: likedByUser, error: likedError } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user?.id || '')
        .single();
        
      // Count comments
      const { count: commentsCount, error: commentsError } = await supabase
        .from('comments')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', postId);
        
      if (likesError || commentsError) {
        throw new Error('Failed to fetch post metadata');
      }
      
      return {
        likes: likesCount || 0,
        is_liked: !!likedByUser,
        comments: commentsCount || 0
      };
    } catch (error) {
      console.error('Error fetching post metadata:', error);
      return { likes: 0, is_liked: false, comments: 0 };
    }
  };
  
  const fetchUserClubs = async () => {
    if (user?.role !== 'clubRepresentative') return;
    
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('id, name')
        .eq('representative_id', user.id)
        .eq('status', 'approved');
        
      if (error) {
        throw error;
      }
      
      setUserClubs(data || []);
    } catch (error) {
      console.error('Error fetching user clubs:', error);
    }
  };
  
  const handleLikePost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      if (post.isLiked) {
        // Unlike the post
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
          
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, isLiked: false, likes: p.likes - 1 };
          }
          return p;
        }));
      } else {
        // Like the post
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });
          
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, isLiked: true, likes: p.likes + 1 };
          }
          return p;
        }));
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };
  
  const handleFlagPost = async () => {
    if (!selectedPostId) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({ is_flagged: true })
        .eq('id', selectedPostId);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Post flagged",
        description: "The post has been flagged for review"
      });
      
      // Update local state
      setPosts(posts.map(post => {
        if (post.id === selectedPostId) {
          return { ...post, is_flagged: true };
        }
        return post;
      }));
      
    } catch (error) {
      console.error('Error flagging post:', error);
      toast({
        title: "Error",
        description: "Failed to flag post",
        variant: "destructive",
      });
    } finally {
      setFlagAlertOpen(false);
      setSelectedPostId(null);
    }
  };
  
  const handleDeletePost = async () => {
    if (!selectedPostId) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', selectedPostId);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Post deleted",
        description: "The post has been permanently deleted"
      });
      
      // Update local state
      setPosts(posts.filter(post => post.id !== selectedPostId));
      
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setDeleteAlertOpen(false);
      setSelectedPostId(null);
    }
  };
  
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      postType: '',
      author: '',
      tags: [],
    });
  };
  
  useEffect(() => {
    fetchPosts();
    fetchUserClubs();
  }, [user, filters]);
  
  // Get post type icon based on post type
  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'job':
        return <Briefcase className="h-4 w-4" />;
      case 'achievement':
        return <Award className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold dark:text-white">Community</h1>
        <p className="text-muted-foreground dark:text-gray-400">Stay updated with the latest campus activities</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create post card */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={user?.profile?.avatar_url || "https://via.placeholder.com/150?text=User"} />
                  <AvatarFallback>{user?.profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left text-muted-foreground rounded-full h-auto py-2 px-4 dark:bg-gray-700 dark:border-gray-600"
                    onClick={() => setCreatePostOpen(true)}
                  >
                    Share something with the community...
                  </Button>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="gap-2 dark:text-gray-300" onClick={() => setCreatePostOpen(true)}>
                        <Image className="h-4 w-4" />
                        Photo
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 dark:text-gray-300" onClick={() => setCreatePostOpen(true)}>
                        <Smile className="h-4 w-4" />
                        Feeling
                      </Button>
                    </div>
                    <Button onClick={() => setCreatePostOpen(true)}>
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Posts list */}
          <div className="space-y-4">
            {isLoading ? (
              // Skeleton loading
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20 mt-1" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-32 w-full mt-4 rounded-md" />
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <div className="flex gap-4">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </CardFooter>
                </Card>
              ))
            ) : posts.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-8 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium dark:text-white">No posts found</h3>
                    <p className="text-muted-foreground dark:text-gray-400">
                      {filters.search || filters.postType || filters.author || filters.tags.length > 0
                        ? "No posts match your current filters. Try adjusting your search criteria."
                        : "Be the first to share something with the community!"}
                    </p>
                    <Button onClick={() => setCreatePostOpen(true)} className="mt-2">
                      Create Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={() => handleLikePost(post.id)}
                  onFlag={(postId) => {
                    setSelectedPostId(postId);
                    setFlagAlertOpen(true);
                  }}
                  onDelete={(postId) => {
                    setSelectedPostId(postId);
                    setDeleteAlertOpen(true);
                  }}
                  currentUserId={user?.id || ''}
                  userRole={user?.role || 'student'}
                  postTypeIcon={getPostTypeIcon(post.post_type)}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Post filters */}
          <PostFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            userRole={user?.role || 'student'}
          />
          
          {/* Trending topics */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <h3 className="font-semibold dark:text-white">Trending Topics</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="px-3 py-1 dark:bg-gray-700">
                  #FresherWelcome
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">128 posts</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="px-3 py-1 dark:bg-gray-700">
                  #Hackathon2023
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">96 posts</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="px-3 py-1 dark:bg-gray-700">
                  #CampusFest
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">82 posts</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="px-3 py-1 dark:bg-gray-700">
                  #CareerFair
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">64 posts</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Active clubs */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <h3 className="font-semibold dark:text-white">Active Clubs</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://via.placeholder.com/150?text=PC" />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium dark:text-white">Programming Club</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">12 posts this week</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="dark:text-gray-300">
                  <Link to="/clubs/1">View</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://via.placeholder.com/150?text=SC" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium dark:text-white">Student Council</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">9 posts this week</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="dark:text-gray-300">
                  <Link to="/clubs/3">View</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://via.placeholder.com/150?text=Photo" />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium dark:text-white">Photography Club</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">8 posts this week</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="dark:text-gray-300">
                  <Link to="/clubs/2">View</Link>
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full dark:text-gray-300 dark:border-gray-600">
                <PlusCircle className="h-4 w-4 mr-2" />
                <Link to="/clubs" className="w-full">Discover More Clubs</Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Upcoming events */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <h3 className="font-semibold dark:text-white">Upcoming Events</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b pb-3 dark:border-gray-700">
                <p className="font-medium dark:text-white">Hackathon 2023</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nov 15-16 • Programming Club</p>
              </div>
              <div className="border-b pb-3 dark:border-gray-700">
                <p className="font-medium dark:text-white">Fresher's Party</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nov 10 • Student Council</p>
              </div>
              <div>
                <p className="font-medium dark:text-white">Photography Exhibition</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nov 5 • Photography Club</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full dark:text-gray-300 dark:border-gray-600">
                <Link to="/events" className="w-full">View All Events</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Create post dialog */}
      <CreatePostDialog 
        open={createPostOpen} 
        onOpenChange={setCreatePostOpen}
        onPostCreated={fetchPosts}
        userClubs={userClubs}
      />
      
      {/* Flag post alert dialog */}
      <AlertDialog open={flagAlertOpen} onOpenChange={setFlagAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Flag Post</AlertDialogTitle>
            <AlertDialogDescription>
              This action will flag the post for review. Flagged posts are hidden from regular users but visible to admins. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFlagPost} className="bg-yellow-600 hover:bg-yellow-700">
              Flag Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete post alert dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be permanently deleted. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Post Card Component
interface PostCardProps {
  post: Post;
  onLike: () => void;
  onFlag: (postId: string) => void;
  onDelete: (postId: string) => void;
  currentUserId: string;
  userRole: string;
  postTypeIcon: React.ReactNode;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike,
  onFlag,
  onDelete,
  currentUserId,
  userRole,
  postTypeIcon
}) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    ).replace('in ', '');
  };
  
  const isOwner = post.author_id === currentUserId;
  const isAdmin = userRole === 'admin';
  const canModify = isOwner || isAdmin;
  
  return (
    <Card className={`dark:bg-gray-800 dark:border-gray-700 relative ${post.is_flagged ? 'border-yellow-500 dark:border-yellow-500' : ''}`}>
      {post.is_flagged && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 px-2 py-1 rounded-full text-xs flex items-center">
          <AlertTriangle size={12} className="mr-1" />
          Flagged
        </div>
      )}
      
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage 
                src={post.club ? post.club.logo_url || "https://via.placeholder.com/150?text=Club" : post.author?.avatar_url || "https://via.placeholder.com/150?text=User"} 
              />
              <AvatarFallback>
                {post.club ? post.club.name.charAt(0) : post.author?.full_name.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <p className="font-medium dark:text-white">
                  {post.club ? post.club.name : post.author?.full_name}
                </p>
                {/* Post type badge */}
                {postTypeIcon && (
                  <Badge variant="outline" className="ml-2 px-2 py-0 h-5 text-xs flex items-center gap-1 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                    {postTypeIcon}
                    {post.post_type.charAt(0).toUpperCase() + post.post_type.slice(1)}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(post.created_at)}
              </p>
            </div>
          </div>
          
          {/* Post actions dropdown */}
          {canModify && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAdmin && !post.is_flagged && (
                  <DropdownMenuItem onClick={() => onFlag(post.id)}>
                    <Flag size={16} className="mr-2 text-yellow-600" />
                    <span>Flag Post</span>
                  </DropdownMenuItem>
                )}
                
                {canModify && (
                  <DropdownMenuItem onClick={() => onDelete(post.id)}>
                    <Trash2 size={16} className="mr-2 text-red-600" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="font-medium text-lg mb-1 dark:text-white">{post.title}</p>
        <p className="text-gray-700 mb-4 dark:text-gray-300">{post.content}</p>
        
        {post.image_url && (
          <img 
            src={post.image_url} 
            alt="Post image" 
            className="rounded-md w-full h-auto object-cover mb-2"
          />
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 dark:text-gray-300" 
            onClick={onLike}
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 dark:text-gray-300">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="dark:text-gray-300">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Community;
