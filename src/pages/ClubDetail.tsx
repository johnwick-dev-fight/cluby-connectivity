
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Heart, MessageSquare, Bell, Share2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for club details
const MOCK_CLUB = {
  id: '1',
  name: 'Programming Club',
  description: 'A community of coding enthusiasts who love to build and learn together. We organize workshops, hackathons, and coding competitions to help students improve their programming skills and stay updated with the latest technologies.',
  longDescription: `The Programming Club is a student-run organization dedicated to fostering a community of tech enthusiasts on campus. We believe in learning by doing and provide a platform for students to collaborate on projects, share knowledge, and participate in coding competitions.

Our club welcomes students from all departments and skill levels. Whether you're a beginner curious about programming or an experienced developer looking to share your knowledge, there's a place for you here.

Throughout the academic year, we organize:
- Weekly coding sessions and problem-solving meetups
- Technical workshops on various programming languages and frameworks
- Hackathons and coding competitions
- Industry talks and networking events with tech professionals`,
  founded: 'September 2019',
  members: 128,
  events: 12,
  posts: 45,
  logo: 'https://via.placeholder.com/150?text=PC',
  coverImage: 'https://via.placeholder.com/800x300?text=Programming+Club',
  tags: ['Technology', 'Coding', 'Web Development', 'Artificial Intelligence', 'Open Source'],
  isFollowing: false,
  isMember: false,
  socialLinks: {
    website: 'https://example.com',
    instagram: 'https://instagram.com/progclub',
    github: 'https://github.com/progclub'
  },
  location: 'Computer Science Building, Room 203',
  meetingTime: 'Wednesdays, 5:00 PM - 7:00 PM',
  leaders: [
    { id: '1', name: 'Alex Johnson', role: 'President', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Emma Davis', role: 'Vice President', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '3', name: 'Ryan Smith', role: 'Technical Lead', avatar: 'https://i.pravatar.cc/150?img=3' }
  ],
  upcomingEvents: [
    {
      id: '1',
      title: 'Web Development Workshop',
      date: 'October 25, 2023',
      time: '5:00 PM - 7:00 PM',
      location: 'Computer Lab',
      attendees: 42
    },
    {
      id: '2',
      title: 'Hackathon 2023',
      date: 'November 15-16, 2023',
      time: '9:00 AM - 9:00 PM',
      location: 'Student Center',
      attendees: 85
    }
  ],
  recentPosts: [
    {
      id: '1',
      title: 'Workshop Announcement: Web Development Basics',
      content: 'Join us for a hands-on workshop where we\'ll cover HTML, CSS, and JavaScript fundamentals.',
      author: 'Alex Johnson',
      authorAvatar: 'https://i.pravatar.cc/150?img=1',
      date: 'October 15, 2023',
      likes: 24,
      comments: 8
    },
    {
      id: '2',
      title: 'Hackathon 2023 Registration Now Open!',
      content: 'Our annual hackathon is coming up next month. Register now to secure your spot and form your team.',
      author: 'Emma Davis',
      authorAvatar: 'https://i.pravatar.cc/150?img=5',
      date: 'October 10, 2023',
      likes: 36,
      comments: 12
    }
  ],
  openPositions: [
    {
      id: '1',
      title: 'Workshop Coordinator',
      description: 'Organize and coordinate technical workshops for club members.',
      applications: 5,
      deadline: 'October 30, 2023'
    },
    {
      id: '2',
      title: 'Social Media Manager',
      description: 'Handle club\'s social media presence and create engaging content.',
      applications: 3,
      deadline: 'October 28, 2023'
    }
  ]
};

const ClubDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isFollowing, setIsFollowing] = useState(MOCK_CLUB.isFollowing);
  const [isMember, setIsMember] = useState(MOCK_CLUB.isMember);
  const { toast } = useToast();
  
  // In a real app, you would fetch the club details using the ID
  const club = MOCK_CLUB;
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You will no longer receive updates from ${club.name}`
        : `You'll receive updates from ${club.name}`,
    });
  };
  
  const handleJoin = () => {
    if (isMember) {
      // Implement leave logic
      toast({
        title: "Left Club",
        description: `You have left ${club.name}`,
      });
    } else {
      // Implement join logic
      toast({
        title: "Request Sent",
        description: `Your request to join ${club.name} has been sent`,
      });
    }
    setIsMember(!isMember);
  };

  return (
    <div className="space-y-6">
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-cluby-100 to-blue-100 rounded-lg overflow-hidden">
        {club.coverImage && (
          <img 
            src={club.coverImage} 
            alt={club.name} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <img 
              src={club.logo} 
              alt={club.name} 
              className="rounded-full border-4 border-white h-20 w-20 object-cover bg-white shadow-sm -mt-10 md:mt-0"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{club.name}</h1>
              <div className="flex flex-wrap gap-1 mt-2">
                {club.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button onClick={handleFollow} variant="outline">
                {isFollowing ? (
                  <>
                    <Bell className="h-4 w-4 mr-2 fill-cluby-500" />
                    Following
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
              <Button onClick={handleJoin}>
                {isMember ? "Leave Club" : "Join Club"}
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>About {club.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="whitespace-pre-line text-gray-700">{club.longDescription}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Founded</p>
                      <p>{club.founded}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Members</p>
                      <p>{club.members} active members</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Meeting Time</p>
                      <p>{club.meetingTime}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Location</p>
                      <p>{club.location}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Club Leadership</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {club.leaders.map((leader) => (
                        <div key={leader.id} className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={leader.avatar} />
                            <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{leader.name}</p>
                            <p className="text-sm text-gray-500">{leader.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Connect with {club.name}</h3>
                    <div className="flex gap-2">
                      {club.socialLinks.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={club.socialLinks.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      )}
                      {club.socialLinks.instagram && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={club.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                            Instagram
                          </a>
                        </Button>
                      )}
                      {club.socialLinks.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={club.socialLinks.github} target="_blank" rel="noopener noreferrer">
                            GitHub
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="events" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Events organized by {club.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {club.upcomingEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="bg-gradient-to-r from-cluby-50 to-blue-50 p-4 border-b">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <div className="flex flex-wrap gap-y-2 mt-2">
                          <div className="flex items-center text-sm text-gray-600 mr-4">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mr-4">
                            <Clock className="h-4 w-4 mr-1" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-600">{event.attendees} attending</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Register</Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="posts" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                  <CardDescription>Updates and announcements from {club.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {club.recentPosts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarImage src={post.authorAvatar} />
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{post.author}</p>
                            <p className="text-xs text-gray-500">{post.date}</p>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                        <p className="text-gray-700 mb-4">{post.content}</p>
                        
                        <div className="flex justify-between items-center pt-2 border-t">
                          <div className="flex gap-4">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Heart className="h-4 w-4" />
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
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recruitment" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Open Positions</CardTitle>
                  <CardDescription>Join the team at {club.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {club.openPositions.length > 0 ? (
                    club.openPositions.map((position) => (
                      <Card key={position.id}>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg">{position.title}</h3>
                          <p className="text-gray-700 mt-1 mb-3">{position.description}</p>
                          
                          <div className="flex justify-between items-center flex-wrap gap-y-2">
                            <div className="space-x-4">
                              <Badge variant="outline" className="text-amber-700 bg-amber-50">
                                Deadline: {position.deadline}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {position.applications} applications
                              </span>
                            </div>
                            <Button>Apply Now</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No open positions at the moment</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Club Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{club.members}</p>
                  <p className="text-sm text-gray-500">Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{club.events}</p>
                  <p className="text-sm text-gray-500">Events</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{club.posts}</p>
                  <p className="text-sm text-gray-500">Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {club.upcomingEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Similar Clubs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://via.placeholder.com/150?text=AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">AI Research Club</p>
                  <p className="text-sm text-gray-500">86 members</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://via.placeholder.com/150?text=Game" />
                  <AvatarFallback>GD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">Game Development Society</p>
                  <p className="text-sm text-gray-500">64 members</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://via.placeholder.com/150?text=CP" />
                  <AvatarFallback>CP</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">Competitive Programming</p>
                  <p className="text-sm text-gray-500">92 members</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper component for the clock icon
const Clock = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default ClubDetail;
