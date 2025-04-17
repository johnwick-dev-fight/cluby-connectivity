
import { ObjectId } from 'mongodb';

// Sample clubs data
export const sampleClubs = [
  {
    _id: new ObjectId(),
    name: "Programming Club",
    description: "A community of coding enthusiasts",
    logo_url: "/placeholder.svg",
    objectives: "Learn and grow together through coding projects",
    status: "approved",
    representative_id: new ObjectId(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new ObjectId(),
    name: "Photography Club",
    description: "Capturing moments that matter",
    logo_url: "/placeholder.svg",
    objectives: "Develop photography skills and showcase talent",
    status: "approved",
    representative_id: new ObjectId(),
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Sample events data
export const sampleEvents = [
  {
    _id: new ObjectId(),
    title: "Code Workshop",
    description: "Learn the basics of web development",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    club_id: sampleClubs[0]._id,
    organizer_id: sampleClubs[0].representative_id,
    location: "Computer Lab",
    status: "upcoming",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new ObjectId(),
    title: "Photo Exhibition",
    description: "Annual photography showcase",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    club_id: sampleClubs[1]._id,
    organizer_id: sampleClubs[1].representative_id,
    location: "Art Gallery",
    status: "upcoming",
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Sample posts data
export const samplePosts = [
  {
    _id: new ObjectId(),
    title: "Welcome to Programming Club!",
    content: "Join us for our first meeting of the semester.",
    club_id: sampleClubs[0]._id,
    author_id: sampleClubs[0].representative_id,
    post_type: "announcement",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new ObjectId(),
    title: "Photography Contest",
    content: "Submit your best shots for a chance to win prizes!",
    club_id: sampleClubs[1]._id,
    author_id: sampleClubs[1].representative_id,
    post_type: "event",
    created_at: new Date(),
    updated_at: new Date()
  }
];
