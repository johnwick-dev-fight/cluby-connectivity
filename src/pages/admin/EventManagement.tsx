
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { 
  Check, 
  X, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Loader2,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Define interfaces with exact properties from database
interface Profile {
  full_name: string;
  avatar_url: string | null;
}

interface Club {
  id: string;
  name: string;
  logo_url: string | null;
}

interface Event {
  id: string;
  title: string;
  description: string;
  club_id: string;
  created_by: string;
  event_type: string;
  location: string;
  start_time: string;
  end_time: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  club?: Club;
  profile?: Profile | null; // Make profile optional or null
  ui_status?: 'pending' | 'approved' | 'rejected'; // UI only field
}

const EventManagement = () => {
  const queryClient = useQueryClient();
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  
  // Fetch events
  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          club:club_id(*)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      // For each event, fetch the creator's profile separately
      const eventsWithProfiles = await Promise.all(data.map(async (event) => {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', event.created_by)
          .single();
          
        return {
          ...event,
          profile: profileError ? null : profileData
        };
      }));

      return eventsWithProfiles as Event[];
    },
  });

  // Mutation for approving/rejecting events (simulated for UI)
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, ui_status }: { id: string; ui_status: 'approved' | 'rejected' }) => {
      // In a real application with a status column:
      // const { error } = await supabase
      //   .from('events')
      //   .update({ status: status })
      //   .eq('id', id);
      // if (error) throw error;
      
      // Simulate for UI only
      return { id, ui_status };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-events'], (oldData: Event[] | undefined) => 
        oldData?.map(event => 
          event.id === data.id 
            ? { ...event, ui_status: data.ui_status } 
            : event
        )
      );
      
      toast({
        title: `Event ${data.ui_status}`,
        description: `The event has been ${data.ui_status} successfully.`,
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

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(['admin-events'], (oldData: Event[] | undefined) => 
        oldData?.filter(event => event.id !== id)
      );
      
      toast({
        title: "Event deleted",
        description: "The event has been permanently deleted.",
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

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
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
        <h1 className="text-3xl font-bold">Event Management</h1>
        <p className="text-muted-foreground">Review and moderate events</p>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
              <CardDescription>
                View and manage all events in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of all events in the system</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Club</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events && events.length > 0 ? (
                    events.map((event) => (
                      <React.Fragment key={event.id}>
                        <TableRow>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={event.club?.logo_url || ''} alt={event.club?.name} />
                                <AvatarFallback>{event.club?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span>{event.club?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{event.title}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleEventExpansion(event.id)}
                                className="p-0 h-6 w-6"
                              >
                                {expandedEvents[event.id] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                              <Badge>{event.event_type}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                {format(parseISO(event.start_time), 'MMM d, yyyy')}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {format(parseISO(event.start_time), 'h:mm a')}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={event.profile?.avatar_url || ''} alt={event.profile?.full_name} />
                                <AvatarFallback>
                                  {event.profile?.full_name 
                                    ? event.profile.full_name.substring(0, 2).toUpperCase() 
                                    : 'UN'}
                                </AvatarFallback>
                              </Avatar>
                              <span>{event.profile?.full_name || 'Unknown'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {event.ui_status ? (
                                <Badge 
                                  variant={
                                    event.ui_status === 'approved' 
                                      ? 'default' 
                                      : event.ui_status === 'rejected' 
                                        ? 'destructive' 
                                        : 'outline'
                                  }
                                  className={event.ui_status === 'approved' ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                  {event.ui_status.charAt(0).toUpperCase() + event.ui_status.slice(1)}
                                </Badge>
                              ) : (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateEventMutation.mutate({ id: event.id, ui_status: 'approved' })}
                                    className="h-8 text-green-600 border-green-600 hover:bg-green-50"
                                  >
                                    <Check className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => deleteEventMutation.mutate(event.id)}
                                    className="h-8 text-red-600 border-red-600 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4 mr-1" /> Delete
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {expandedEvents[event.id] && (
                          <TableRow className="bg-gray-50 dark:bg-gray-800">
                            <TableCell colSpan={5}>
                              <div className="space-y-4 p-4">
                                {event.image_url && (
                                  <div>
                                    <img 
                                      src={event.image_url} 
                                      alt={event.title} 
                                      className="rounded-md max-h-80 object-contain" 
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center mb-2">
                                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                    <span className="text-sm">{event.location}</span>
                                  </div>
                                  <h4 className="font-medium">Description:</h4>
                                  <p className="whitespace-pre-line text-sm">{event.description}</p>
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
                          <h3 className="text-lg font-medium">No events found</h3>
                          <p>There are no events in the system yet.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events scheduled in the future</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mb-2" />
                <h3 className="text-lg font-medium">No upcoming events</h3>
                <p>There are no upcoming events scheduled.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Events</CardTitle>
              <CardDescription>Events that have already taken place</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mb-2" />
                <h3 className="text-lg font-medium">No past events</h3>
                <p>There are no past events in the system.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventManagement;
