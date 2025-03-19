
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  CalendarDays 
} from 'lucide-react';
import { format, addDays, isBefore, isToday, isAfter } from 'date-fns';

// Mock data for events
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Tech Hackathon 2023',
    description: 'A 24-hour coding competition to build innovative solutions for real-world problems.',
    date: addDays(new Date(), 5),
    time: '10:00 AM - 10:00 AM (next day)',
    location: 'Engineering Building, Room 203',
    organizer: 'Programming Club',
    organizerId: '1',
    attendees: 85,
    maxAttendees: 100,
    isRegistered: false,
    tags: ['Technology', 'Coding', 'Competition'],
    featured: true,
    image: 'https://via.placeholder.com/600x300?text=Hackathon'
  },
  {
    id: '2',
    title: 'Photography Workshop',
    description: 'Learn the basics of digital photography and editing from professional photographers.',
    date: addDays(new Date(), 2),
    time: '2:00 PM - 5:00 PM',
    location: 'Arts Center, Photography Studio',
    organizer: 'Photography Club',
    organizerId: '2',
    attendees: 32,
    maxAttendees: 30,
    isRegistered: true,
    tags: ['Arts', 'Photography', 'Workshop'],
    featured: false,
    image: 'https://via.placeholder.com/600x300?text=Photography'
  },
  {
    id: '3',
    title: 'Debate Competition: Future of AI',
    description: 'A formal debate discussing ethical implications and future prospects of artificial intelligence.',
    date: addDays(new Date(), -1),
    time: '4:00 PM - 6:00 PM',
    location: 'Humanities Hall, Auditorium',
    organizer: 'Debate Club',
    organizerId: '3',
    attendees: 120,
    maxAttendees: 150,
    isRegistered: false,
    tags: ['Debate', 'Technology', 'Ethics'],
    featured: false,
    image: 'https://via.placeholder.com/600x300?text=Debate'
  },
  {
    id: '4',
    title: 'Annual College Festival',
    description: 'Celebrating college culture with music, dance, food, and various competitions.',
    date: addDays(new Date(), 15),
    time: '10:00 AM - 10:00 PM',
    location: 'College Grounds',
    organizer: 'Student Council',
    organizerId: '5',
    attendees: 520,
    maxAttendees: 1000,
    isRegistered: true,
    tags: ['Festival', 'Cultural', 'Music'],
    featured: true,
    image: 'https://via.placeholder.com/600x300?text=Festival'
  },
  {
    id: '5',
    title: 'Basketball Tournament',
    description: 'Inter-departmental basketball competition with exciting prizes.',
    date: addDays(new Date(), 0),
    time: '3:00 PM - 7:00 PM',
    location: 'Sports Complex, Basketball Court',
    organizer: 'Sports Club',
    organizerId: '5',
    attendees: 65,
    maxAttendees: 80,
    isRegistered: false,
    tags: ['Sports', 'Basketball', 'Competition'],
    featured: false,
    image: 'https://via.placeholder.com/600x300?text=Basketball'
  },
];

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Filter events based on search and active tab
  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'upcoming') return matchesSearch && isAfter(event.date, new Date()) && !isToday(event.date);
    if (activeTab === 'today') return matchesSearch && isToday(event.date);
    if (activeTab === 'past') return matchesSearch && isBefore(event.date, new Date()) && !isToday(event.date);
    if (activeTab === 'registered') return matchesSearch && event.isRegistered;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="text-muted-foreground">Discover and attend campus events</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="sm:w-auto w-full">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="registered">Registered</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-gray-500 dark:text-gray-400">No events found matching your criteria</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EventCard = ({ event }: { event: any }) => {
  const isPast = isBefore(event.date, new Date()) && !isToday(event.date);
  const isTodays = isToday(event.date);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow dark:border-gray-800">
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-40 object-cover"
        />
        {event.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-500">
              <Star className="h-3 w-3 mr-1" /> Featured
            </Badge>
          </div>
        )}
        {isPast && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge className="bg-gray-600 text-white px-4 py-1 text-sm">
              Event Ended
            </Badge>
          </div>
        )}
        {isTodays && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-green-500 text-white">
              Happening Today
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div>
          <h3 className="font-semibold text-xl line-clamp-1">{event.title}</h3>
          <p className="text-sm text-muted-foreground">Organized by {event.organizer}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {event.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{event.description}</p>
        
        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{format(event.date, 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>
              {event.attendees}/{event.maxAttendees} attending
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          variant={event.isRegistered ? "outline" : "default"} 
          className="w-full"
          disabled={isPast || (event.attendees >= event.maxAttendees && !event.isRegistered)}
        >
          {isPast ? 'Event Ended' : 
           event.isRegistered ? 'Registered' : 
           event.attendees >= event.maxAttendees ? 'Fully Booked' : 'Register'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Events;
