
import dbConnect from '../lib/mongodb/db';
import { sampleClubs, sampleEvents, samplePosts } from '../lib/mongodb/seed/seedData';
import Club from '../lib/mongodb/models/Club';
import Event from '../lib/mongodb/models/Event';
import Post from '../lib/mongodb/models/Post';

export async function GET() {
  try {
    await dbConnect();

    // Clear existing data
    await Promise.all([
      Club.deleteMany({}),
      Event.deleteMany({}),
      Post.deleteMany({})
    ]);

    // Insert sample data
    await Promise.all([
      Club.insertMany(sampleClubs),
      Event.insertMany(sampleEvents),
      Post.insertMany(samplePosts)
    ]);

    return new Response(JSON.stringify({
      success: true,
      message: 'Database seeded successfully',
      data: {
        clubs: sampleClubs.length,
        events: sampleEvents.length,
        posts: samplePosts.length
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error seeding database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
