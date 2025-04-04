
import mongoose from 'mongoose';
import dbConnect from './db';
import User from './models/User';
import Profile from './models/Profile';
import Club from './models/Club';
import Post from './models/Post';
import Event from './models/Event';
import Recruitment from './models/Recruitment';
import Application from './models/Application';
import ClubMembership from './models/ClubMembership';

// This function initializes the database with some mock data for development
export async function initializeDatabase() {
  // Only run on server and in development mode
  if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  try {
    await dbConnect();
    console.log('Connected to MongoDB. Checking for existing data...');
    
    // Only initialize if there are no users
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has data. Skipping initialization.');
      return;
    }
    
    console.log('Initializing database with mock data...');
    
    // Create admin user
    const adminUser = await User.create({
      email: 'admin@cluby.com',
      password: '$2a$10$XvXeCnpGYKJpVHPeiTRuO.yZi9x.VXZ2p.5Oj6b7YLw5rvYm1vLJC', // hashed 'admin123'
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    await Profile.create({
      user_id: adminUser._id,
      full_name: 'Admin User',
      username: 'admin',
      avatar_url: '/avatar-placeholder.jpg',
      bio: 'Platform administrator',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Create club representative users
    const progClubRepUser = await User.create({
      email: 'progrep@cluby.com',
      password: '$2a$10$XvXeCnpGYKJpVHPeiTRuO.yZi9x.VXZ2p.5Oj6b7YLw5rvYm1vLJC', // hashed 'rep123'
      role: 'clubRepresentative',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    await Profile.create({
      user_id: progClubRepUser._id,
      full_name: 'Programming Club Rep',
      username: 'progrep',
      avatar_url: '/avatar-placeholder.jpg',
      bio: 'Representative of the Programming Club',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const photoClubRepUser = await User.create({
      email: 'photorep@cluby.com',
      password: '$2a$10$XvXeCnpGYKJpVHPeiTRuO.yZi9x.VXZ2p.5Oj6b7YLw5rvYm1vLJC', // hashed 'rep123'
      role: 'clubRepresentative',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    await Profile.create({
      user_id: photoClubRepUser._id,
      full_name: 'Photography Club Rep',
      username: 'photorep',
      avatar_url: '/avatar-placeholder.jpg',
      bio: 'Representative of the Photography Club',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Create student user
    const studentUser = await User.create({
      email: 'student@cluby.com',
      password: '$2a$10$XvXeCnpGYKJpVHPeiTRuO.yZi9x.VXZ2p.5Oj6b7YLw5rvYm1vLJC', // hashed 'student123'
      role: 'student',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    await Profile.create({
      user_id: studentUser._id,
      full_name: 'John Student',
      username: 'johnstudent',
      avatar_url: '/avatar-placeholder.jpg',
      department: 'Computer Science',
      year: '2nd Year',
      bio: 'Computer Science student interested in programming and photography',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Create clubs
    const programmingClub = await Club.create({
      name: 'Programming Club',
      logo_url: '/avatar-placeholder.jpg',
      banner_url: '/placeholder.svg',
      description: 'A club for programming enthusiasts',
      objectives: 'Learning and sharing programming knowledge',
      representative_id: progClubRepUser._id,
      status: 'approved',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const photographyClub = await Club.create({
      name: 'Photography Club',
      logo_url: '/avatar-placeholder.jpg',
      banner_url: '/placeholder.svg',
      description: 'A club for photography enthusiasts',
      objectives: 'Capturing moments and sharing techniques',
      representative_id: photoClubRepUser._id,
      status: 'approved',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Create pending club
    await Club.create({
      name: 'Debate Club',
      logo_url: '/avatar-placeholder.jpg',
      description: 'A club for debating current issues',
      objectives: 'Enhancing communication and critical thinking',
      representative_id: studentUser._id,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Create posts
    await Post.create({
      title: 'Welcome to Programming Club',
      content: 'Join us for the kickoff meeting of the new semester!',
      club_id: programmingClub._id,
      author_id: progClubRepUser._id,
      post_type: 'general',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    await Post.create({
      title: 'Photography Contest',
      content: 'Submit your best shots for a chance to win prizes!',
      club_id: photographyClub._id,
      author_id: photoClubRepUser._id,
      post_type: 'event',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Create events
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    await Event.create({
      title: 'Coding Hackathon',
      description: 'Join us for a 24-hour coding challenge!',
      date: oneWeekFromNow,
      location: 'Computer Science Building',
      club_id: programmingClub._id,
      organizer_id: progClubRepUser._id,
      status: 'upcoming',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    
    await Event.create({
      title: 'Photography Exhibition',
      description: 'Annual exhibition showcasing student photography',
      date: twoWeeksFromNow,
      location: 'Arts Center',
      club_id: photographyClub._id,
      organizer_id: photoClubRepUser._id,
      status: 'upcoming',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Create recruitments
    const applicationDeadline = new Date();
    applicationDeadline.setDate(applicationDeadline.getDate() + 14);
    
    await Recruitment.create({
      title: 'Web Developer',
      description: 'Looking for experienced web developers to join our team',
      requirements: 'HTML, CSS, JavaScript, React experience required',
      club_id: programmingClub._id,
      created_by: progClubRepUser._id,
      positions_available: 2,
      application_deadline: applicationDeadline,
      status: 'open',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const applicationDeadline2 = new Date();
    applicationDeadline2.setDate(applicationDeadline2.getDate() + 21);
    
    await Recruitment.create({
      title: 'Photographer',
      description: 'Seeking photographers for our upcoming events',
      requirements: 'Experience with DSLR cameras and photo editing software',
      club_id: photographyClub._id,
      created_by: photoClubRepUser._id,
      positions_available: 3,
      application_deadline: applicationDeadline2,
      status: 'open',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Create club memberships
    await ClubMembership.create({
      club_id: programmingClub._id,
      user_id: studentUser._id,
      role: 'member',
      join_date: new Date(),
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    await ClubMembership.create({
      club_id: photographyClub._id,
      user_id: studentUser._id,
      role: 'member',
      join_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      status: 'active',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    });
    
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Invoke the initialization function if in development
if (process.env.NODE_ENV === 'development') {
  initializeDatabase().catch(console.error);
}
