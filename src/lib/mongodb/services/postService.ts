
import { ObjectId } from 'mongodb';
import dbConnect from '../db';
import Post from '../models/Post';

// Mock data for client-side development
const MOCK_POSTS = [
  {
    id: '1',
    title: 'Welcome to Cluby',
    content: 'Join us for the kickoff meeting of the new semester!',
    club_id: '1',
    author_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: null,
    post_type: 'general',
    club: {
      _id: '1',
      name: 'Programming Club',
      logo_url: '/avatar-placeholder.jpg'
    },
    author: {
      _id: '1',
      full_name: 'John Doe',
      avatar_url: '/avatar-placeholder.jpg'
    },
    profile: {
      full_name: 'John Doe',
      avatar_url: '/avatar-placeholder.jpg'
    }
  },
  {
    id: '2',
    title: 'Photography Contest',
    content: 'Submit your best shots for a chance to win prizes!',
    club_id: '2',
    author_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: null,
    post_type: 'event',
    club: {
      _id: '2',
      name: 'Photography Club',
      logo_url: '/avatar-placeholder.jpg'
    },
    author: {
      _id: '2',
      full_name: 'Jane Smith',
      avatar_url: '/avatar-placeholder.jpg'
    },
    profile: {
      full_name: 'Jane Smith',
      avatar_url: '/avatar-placeholder.jpg'
    }
  }
];

// Check if code is running on server or client
const isServer = typeof window === 'undefined';

export async function createPost(postData: any) {
  try {
    if (isServer) {
      await dbConnect();
      const newPost = new Post(postData);
      const savedPost = await newPost.save();
      return { data: savedPost, error: null };
    } else {
      console.log('Mocking post creation with data:', postData);
      return { 
        data: { id: `mock-${Date.now()}`, ...postData, created_at: new Date().toISOString() }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error creating post:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getPosts(query: any = {}) {
  try {
    if (isServer) {
      await dbConnect();
      const posts = await Post.find(query)
        .populate('club_id', 'name logo_url')
        .populate('author_id', 'full_name avatar_url')
        .sort({ created_at: -1 });
        
      return { data: posts, error: null };
    } else {
      console.log('Fetching mock posts with query:', query);
      
      // Filter mock data based on the query
      let filteredPosts = [...MOCK_POSTS];
      
      if (query.post_type) {
        filteredPosts = filteredPosts.filter(post => post.post_type === query.post_type);
      }
      
      if (query.club_id) {
        filteredPosts = filteredPosts.filter(post => post.club_id === query.club_id);
      }
      
      return { data: filteredPosts, error: null };
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getPostById(postId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const post = await Post.findById(postId)
        .populate('club_id', 'name logo_url')
        .populate('author_id', 'full_name avatar_url');
        
      if (!post) {
        return { data: null, error: 'Post not found' };
      }
      
      return { data: post, error: null };
    } else {
      console.log('Fetching mock post with ID:', postId);
      const post = MOCK_POSTS.find(p => p.id === postId);
      return { data: post || null, error: post ? null : 'Post not found' };
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updatePost(postId: string, postData: any) {
  try {
    if (isServer) {
      await dbConnect();
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { ...postData, updated_at: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!updatedPost) {
        return { data: null, error: 'Post not found' };
      }
      
      return { data: updatedPost, error: null };
    } else {
      console.log('Mocking post update with ID:', postId, 'and data:', postData);
      return { 
        data: { id: postId, ...postData, updated_at: new Date().toISOString() }, 
        error: null 
      };
    }
  } catch (error) {
    console.error('Error updating post:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deletePost(postId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const deletedPost = await Post.findByIdAndDelete(postId);
      
      if (!deletedPost) {
        return { data: null, error: 'Post not found' };
      }
      
      return { data: { id: postId, deleted: true }, error: null };
    } else {
      console.log('Mocking post deletion with ID:', postId);
      return { data: { id: postId, deleted: true }, error: null };
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getPostsByClubId(clubId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const posts = await Post.find({ club_id: clubId })
        .populate('author_id', 'full_name avatar_url')
        .sort({ created_at: -1 });
        
      return { data: posts, error: null };
    } else {
      console.log('Fetching mock posts for club ID:', clubId);
      const filteredPosts = MOCK_POSTS.filter(post => post.club_id === clubId);
      return { data: filteredPosts, error: null };
    }
  } catch (error) {
    console.error('Error fetching posts by club ID:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getPostsByAuthorId(authorId: string) {
  try {
    if (isServer) {
      await dbConnect();
      const posts = await Post.find({ author_id: authorId })
        .populate('club_id', 'name logo_url')
        .sort({ created_at: -1 });
        
      return { data: posts, error: null };
    } else {
      console.log('Fetching mock posts for author ID:', authorId);
      const filteredPosts = MOCK_POSTS.filter(post => post.author_id === authorId);
      return { data: filteredPosts, error: null };
    }
  } catch (error) {
    console.error('Error fetching posts by author ID:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
