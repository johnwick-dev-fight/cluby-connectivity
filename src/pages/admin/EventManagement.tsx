
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, Calendar, MapPin, Clock, Search, Filter, Loader2, AlertTriangle, Eye } from 'lucide-react';
import { format } from 'date-fns';

// Type for Event data
interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  location: string;
  image_url: string | null;
  start_time: string;
  end_time: string | null;
  created_at: string;
  club_id: string;
  created_by: string;
  status?: string; // Adding status field
  club?: {
    name: string;
  };
  profile?: {
    full_name: string;
  };
}

const EventManagement = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  // Query to fetch events with club data
  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          club:club_id(name),
          profile:created_by(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching events",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data as Event[];
    },
  });

  // Mutation to approve an event
  const approveEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('events')
        .update({ status: 'approved' })
        .eq('id', eventId);
      
      if (error) throw error;
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({
        title: "Event approved",
        description: "The event has been successfully approved.",
      });
      setIsReviewOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to approve event",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Mutation to decline an event
  const declineEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('events')
        .update({ 
          status: 'declined',
          admin_notes: declineReason
        })
        .eq('id', eventId);
      
      if (error) throw error;
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({
        title: "Event declined",
        description: "The event has been declined.",
      });
      setDeclineReason('');
      setIsReviewOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to decline event",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Mutation to delete an event
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({
        title: "Event deleted",
        description: "The event has been permanently deleted.",
      });
      setIsReviewOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete event",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Filter events based on search and active tab
  const filteredEvents = events?.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.club?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && (!event.status || event.status === 'pending');
    if (activeTab === 'approved') return matchesSearch && event.status === 'approved';
    if (activeTab === 'declined') return matchesSearch && event.status === 'declined';
    
    return matchesSearch;
  });

  const handleReviewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsReviewOpen(true);
  };

  const handleApproveEvent = () => {
    if (selectedEvent) {
      approveEventMutation.mutate(selectedEvent.id);
    }
  };

  const handleDeclineEvent = () => {
    if (selectedEvent) {
      declineEventMutation.mutate(selectedEvent.id);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEventMutation.mutate(selectedEvent.id);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Declined</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Pending Review</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Event Management</h1>
        <p className="text-muted-foreground">Review and manage campus events</p>
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
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="declined">Declined</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents && filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <Card key={event.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{event.title}</CardTitle>
                          <CardDescription>
                            Organized by: {event.club?.name || 'Unknown Club'}
                          </CardDescription>
                        </div>
                        {getStatusBadge(event.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {event.description || "No description provided"}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {event.start_time 
                              ? format(new Date(event.start_time), 'PPP') 
                              : 'Date not specified'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {event.start_time 
                              ? format(new Date(event.start_time), 'p') 
                              : 'Time not specified'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.location || 'Location not specified'}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReviewEvent(event)}
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
                      No events found matching your criteria
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Event Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-3xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  Submitted by {selectedEvent.profile?.full_name || 'Unknown'} from {selectedEvent.club?.name || 'Unknown Club'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-2">
                {selectedEvent.image_url && (
                  <div className="w-full h-48 rounded-md overflow-hidden">
                    <img 
                      src={selectedEvent.image_url} 
                      alt={selectedEvent.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.description || "No description provided"}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Event Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {selectedEvent.start_time 
                            ? format(new Date(selectedEvent.start_time), 'PPP') 
                            : 'Date not specified'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {selectedEvent.start_time 
                            ? `${format(new Date(selectedEvent.start_time), 'p')} - ${selectedEvent.end_time ? format(new Date(selectedEvent.end_time), 'p') : 'TBD'}`
                            : 'Time not specified'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{selectedEvent.location || 'Location not specified'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Event Type</h4>
                    <p className="text-sm">
                      {selectedEvent.event_type || "Not specified"}
                    </p>
                    
                    <h4 className="font-medium mt-4">Submission Date</h4>
                    <p className="text-sm">
                      {format(new Date(selectedEvent.created_at), 'PPP p')}
                    </p>
                  </div>
                </div>
                
                {/* Decline Reason Input - only shown when declining */}
                {selectedEvent.status !== 'approved' && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Reason for Declining (Optional)</h4>
                    <Textarea
                      placeholder="Provide a reason for declining this event..."
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {selectedEvent.status === 'approved' ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsReviewOpen(false)}
                    >
                      Close
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleDeleteEvent}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Delete Event
                    </Button>
                  </>
                ) : selectedEvent.status === 'declined' ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsReviewOpen(false)}
                    >
                      Close
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleDeleteEvent}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Delete Event
                    </Button>
                    <Button 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleApproveEvent}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsReviewOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleDeclineEvent}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                    <Button 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleApproveEvent}
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
    </div>
  );
};

export default EventManagement;
