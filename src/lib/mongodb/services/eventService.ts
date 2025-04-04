
import dbConnect from '../db';
import Event from '../models/Event';

// Mock data for client-side development
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Coding Hackathon',
    description: 'Join us for a 24-hour coding challenge!',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    location: 'Computer Science Building',
    club_id: '1',
    organizer_id: '1',
    status: 'upcoming',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    club: {
      _id: '1',
      name: 'Programming Club',
      logo_url: '/avatar-placeholder.jpg'
    }
  },
  {
    id: '2',
    title: 'Photography Exhibition',
    description: 'Annual exhibition showcasing student photography',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    location: 'Arts Center',
    club_id: '2',
    organizer_id: '2',
    status: 'upcoming',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    club: {
      _id: '2',
      name: 'Photography Club',
      logo_url: '/avatar-placeholder.jpg'
    }
  }
];

// Check if code is running on server or client
const isServer = typeof window === 'undefined';

export async function createEvent(eventData: any) {
  try {
    if (isServer) {
      await dbConnect();
      const newEvent = new Event(eventData);
      const savedEvent = await newEvent.save();
      return { data: savedEvent, error: null };
    } else {
      console.log('Mocking event creation with data:', eventData);
      return { 
        data: { id: `mock-${Date.now()}`, ...eventData, created_at: new Date().toISOString() }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error creating event:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getEvents(query: any = {}) {
  try {
    if (isServer) {
      await dbConnect();
      const events = await Event.find(query)
        .populate('club_id', 'name logo_url')
        .populate('organizer_id', 'full_name')
        .sort({ date: 1 });
        
      return { data: events, error: null };
    } else {
      console.log('Fetching mock events with query:', query);
      
      // Filter mock data based on the query
      let filteredEvents = [...MOCK_EVENTS];
      
      if (query.status) {
        filteredEvents = filteredEvents.filter(event => event.status === query.status);
      }
      
      if (query.club_id) {
        filteredEvents = filteredEvents.filter(event => event.club_id === query.club_id);
      }
      
      return { data: filteredEvents, error: null };
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getEventById(eventId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const event = await Event.findById(eventId)
        .populate('club_id', 'name logo_url')
        .populate('organizer_id', 'full_name');
        
      if (!event) {
        return { data: null, error: 'Event not found' };
      }
      
      return { data: event, error: null };
    } else {
      console.log('Fetching mock event with ID:', eventId);
      const event = MOCK_EVENTS.find(e => e.id === eventId);
      return { data: event || null, error: event ? null : 'Event not found' };
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateEvent(eventId: string, eventData: any) {
  try {
    if (isServer) {
      await dbConnect();
      const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { ...eventData, updated_at: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!updatedEvent) {
        return { data: null, error: 'Event not found' };
      }
      
      return { data: updatedEvent, error: null };
    } else {
      console.log('Mocking event update with ID:', eventId, 'and data:', eventData);
      return { 
        data: { id: eventId, ...eventData, updated_at: new Date().toISOString() }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error updating event:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const deletedEvent = await Event.findByIdAndDelete(eventId);
      
      if (!deletedEvent) {
        return { data: null, error: 'Event not found' };
      }
      
      return { data: { id: eventId, deleted: true }, error: null };
    } else {
      console.log('Mocking event deletion with ID:', eventId);
      return { data: { id: eventId, deleted: true }, error: null };
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getEventsByClubId(clubId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const events = await Event.find({ club_id: clubId })
        .populate('organizer_id', 'full_name')
        .sort({ date: 1 });
        
      return { data: events, error: null };
    } else {
      console.log('Fetching mock events for club ID:', clubId);
      const filteredEvents = MOCK_EVENTS.filter(event => event.club_id === clubId);
      return { data: filteredEvents, error: null };
    }
  } catch (error) {
    console.error('Error fetching events by club ID:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getUpcomingEvents(limit: number = 5) {
  try {
    if (isServer) {
      await dbConnect();
      const now = new Date();
      const events = await Event.find({ date: { $gte: now }, status: 'upcoming' })
        .populate('club_id', 'name logo_url')
        .sort({ date: 1 })
        .limit(limit);
        
      return { data: events, error: null };
    } else {
      console.log('Fetching mock upcoming events');
      const now = new Date();
      const filteredEvents = MOCK_EVENTS
        .filter(event => new Date(event.date) >= now && event.status === 'upcoming')
        .slice(0, limit);
      return { data: filteredEvents, error: null };
    }
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
