
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageSquare, Share2, Send, Image, Smile, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data for community posts
const MOCK_POSTS = [
  {
    id: '1',
    author: {
      id: '1',
      name: 'Programming Club',
      avatar: 'https://via.placeholder.com/150?text=PC',
      verified: true
    },
    content: 'Exciting news! Our annual hackathon is scheduled for November 15-16. Registration opens next week. Get your teams ready!',
    images: ['https://via.placeholder.com/600x400?text=Hackathon+Poster'],
    date: '1 hour ago',
    likes: 42,
    comments: 8,
    isLiked: false
  },
  {
    id: '2',
    author: {
      id: '2',
      name: 'Photography Club',
      avatar: 'https://via.placeholder.com/150?text=Photo',
      verified: true
    },
    content: 'Check out these amazing shots from our weekend photo walk around campus! Thanks to everyone who participated.',
    images: [
      'https://via.placeholder.com/600x400?text=Campus+Photo+1',
      'https://via.placeholder.com/600x400?text=Campus+Photo+2'
    ],
    date: '3 hours ago',
    likes: 36,
    comments: 12,
    isLiked: true
  },
  {
    id: '3',
    author: {
      id: '3',
      name: 'Student Council',
      avatar: 'https://via.placeholder.com/150?text=SC',
      verified: true
    },
    content: 'Reminder: The registration for the fresher\'s party is closing tomorrow at 5 PM. Make sure you\'ve got your tickets!',
    images: [],
    date: '5 hours ago',
    likes: 68,
    comments: 23,
    isLiked: false
  },
  {
    id: '4',
    author: {
      id: '4',
      name: 'Music Club',
      avatar: 'https://via.placeholder.com/150?text=Music',
      verified: true
    },
    content: 'Auditions for the annual music competition will be held next Monday from 2 PM to 5 PM at the Auditorium. All students are welcome to showcase their talents!',
    images: ['https://via.placeholder.com/600x400?text=Music+Competition'],
    date: '8 hours ago',
    likes: 29,
    comments: 5,
    isLiked: false
  }
];

const Community = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };
  
  const handlePost = () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Cannot post",
        description: "Please enter some content for your post",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the post to the server
    toast({
      title: "Post created",
      description: "Your post has been published to the community",
    });
    
    setNewPostContent('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground">Stay updated with the latest campus activities</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src="https://via.placeholder.com/150?text=User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea 
                    placeholder="Share something with the community..."
                    className="resize-none border-none focus-visible:ring-0 p-0 shadow-none h-20"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Image className="h-4 w-4 mr-2" />
                        Photo
                      </Button>
                      <Button variant="outline" size="sm">
                        <Smile className="h-4 w-4 mr-2" />
                        Feeling
                      </Button>
                    </div>
                    <Button onClick={handlePost}>
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6 space-y-4">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={() => handleLikePost(post.id)} 
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Trending Topics</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="px-3 py-1">#FresherWelcome</Badge>
                <span className="text-sm text-gray-500">128 posts</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="px-3 py-1">#Hackathon2023</Badge>
                <span className="text-sm text-gray-500">96 posts</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="px-3 py-1">#CampusFest</Badge>
                <span className="text-sm text-gray-500">82 posts</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="px-3 py-1">#CareerFair</Badge>
                <span className="text-sm text-gray-500">64 posts</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Active Clubs</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://via.placeholder.com/150?text=PC" />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Programming Club</p>
                    <p className="text-sm text-gray-500">12 posts this week</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
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
                    <p className="font-medium">Student Council</p>
                    <p className="text-sm text-gray-500">9 posts this week</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
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
                    <p className="font-medium">Photography Club</p>
                    <p className="text-sm text-gray-500">8 posts this week</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Link to="/clubs/2">View</Link>
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Discover More Clubs
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Upcoming Events</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b pb-3">
                <p className="font-medium">Hackathon 2023</p>
                <p className="text-sm text-gray-500">Nov 15-16 • Programming Club</p>
              </div>
              <div className="border-b pb-3">
                <p className="font-medium">Fresher's Party</p>
                <p className="text-sm text-gray-500">Nov 10 • Student Council</p>
              </div>
              <div>
                <p className="font-medium">Photography Exhibition</p>
                <p className="text-sm text-gray-500">Nov 5 • Photography Club</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Link to="/events" className="w-full">View All Events</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

const PostCard = ({ post, onLike }: { post: any; onLike: () => void }) => {
  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <p className="font-medium">{post.author.name}</p>
              {post.author.verified && (
                <VerifiedBadge />
              )}
            </div>
            <p className="text-xs text-gray-500">{post.date}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-gray-700 mb-4">{post.content}</p>
        
        {post.images.length > 0 && (
          <div className={`grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.images.map((image: string, index: number) => (
              <img 
                key={index}
                src={image} 
                alt={`Post image ${index + 1}`} 
                className="rounded-md w-full h-auto object-cover"
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" className="gap-1" onClick={onLike}>
            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const VerifiedBadge = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-4 h-4 text-blue-500"
  >
    <path 
      fillRule="evenodd" 
      d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" 
      clipRule="evenodd" 
    />
  </svg>
);

export default Community;
