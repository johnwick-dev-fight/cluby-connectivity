
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Users, Calendar, MessageSquare, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for clubs
const MOCK_CLUBS = [
  {
    id: '1',
    name: 'Programming Club',
    description: 'A community of coding enthusiasts who love to build and learn together.',
    members: 128,
    events: 12,
    posts: 45,
    logo: 'https://via.placeholder.com/150?text=PC',
    tags: ['Technology', 'Coding', 'Web Development'],
    isFollowing: true,
    isMember: false,
    featured: true
  },
  {
    id: '2',
    name: 'Photography Club',
    description: 'Capturing moments and creating memories through the lens of a camera.',
    members: 85,
    events: 8,
    posts: 67,
    logo: 'https://via.placeholder.com/150?text=Photo',
    tags: ['Arts', 'Photography', 'Creative'],
    isFollowing: false,
    isMember: true,
    featured: true
  },
  {
    id: '3',
    name: 'Debate Club',
    description: 'Enhancing critical thinking and public speaking skills through debates and discussions.',
    members: 62,
    events: 5,
    posts: 23,
    logo: 'https://via.placeholder.com/150?text=DC',
    tags: ['Speaking', 'Debates', 'Communication'],
    isFollowing: false,
    isMember: false,
    featured: false
  },
  {
    id: '4',
    name: 'Music Club',
    description: 'For students who are passionate about music, singing, and playing instruments.',
    members: 94,
    events: 10,
    posts: 36,
    logo: 'https://via.placeholder.com/150?text=Music',
    tags: ['Arts', 'Music', 'Performance'],
    isFollowing: true,
    isMember: false,
    featured: false
  },
  {
    id: '5',
    name: 'Sports Club',
    description: 'Promoting physical fitness, team spirit, and sportsmanship through various games and activities.',
    members: 156,
    events: 15,
    posts: 42,
    logo: 'https://via.placeholder.com/150?text=Sports',
    tags: ['Sports', 'Fitness', 'Games'],
    isFollowing: false,
    isMember: false,
    featured: true
  },
  {
    id: '6',
    name: 'Dance Club',
    description: 'Expressing emotions and stories through the art of dance and movement.',
    members: 78,
    events: 9,
    posts: 31,
    logo: 'https://via.placeholder.com/150?text=Dance',
    tags: ['Arts', 'Dance', 'Performance'],
    isFollowing: false,
    isMember: false,
    featured: false
  },
];

const Clubs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter clubs based on search and active tab
  const filteredClubs = MOCK_CLUBS.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          club.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'following') return matchesSearch && club.isFollowing;
    if (activeTab === 'member') return matchesSearch && club.isMember;
    if (activeTab === 'featured') return matchesSearch && club.featured;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clubs</h1>
        <p className="text-muted-foreground">Discover and connect with campus clubs</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clubs..."
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
          <TabsTrigger value="all">All Clubs</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="member">Member</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.length > 0 ? (
              filteredClubs.map(club => (
                <ClubCard key={club.id} club={club} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-gray-500">No clubs found matching your criteria</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ClubCard = ({ club }: { club: any }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-0">
        <div className="bg-gradient-to-r from-cluby-100 to-blue-100 h-24 relative">
          {club.featured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-yellow-500">
                <Star className="h-3 w-3 mr-1" /> Featured
              </Badge>
            </div>
          )}
        </div>
        <div className="flex justify-center -mt-10">
          <img 
            src={club.logo} 
            alt={club.name} 
            className="rounded-full border-4 border-white h-20 w-20 object-cover bg-white"
          />
        </div>
        <div className="text-center mt-2">
          <h3 className="font-semibold text-xl">{club.name}</h3>
          <div className="flex justify-center gap-1 mt-1 flex-wrap px-4">
            {club.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600 line-clamp-3">{club.description}</p>
        
        <div className="flex justify-between mt-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{club.members}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{club.events}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{club.posts}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link to={`/clubs/${club.id}`} className="flex-1">
          <Button variant="default" className="w-full">View Club</Button>
        </Link>
        
        <Button variant="outline" size="icon">
          <Heart className={`h-4 w-4 ${club.isFollowing ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Clubs;
