
import Post from '../models/Post';
import Club from '../models/Club';
import User from '../models/User';
import Profile from '../models/Profile';
import dbConnect from '../db';
import mongoose from 'mongoose';

export async function getPosts(query = {}) {
  await dbConnect();
  
  try {
    const posts = await Post.find(query)
      .sort({ created_at: -1 })
      .lean();
    
    // Fetch related club and author data
    const postsWithDetails = await Promise.all(posts.map(async (post) => {
      const club = await Club.findById(post.club_id).lean();
      const profile = await Profile.findOne({ user_id: post.author_id }).lean();
      
      return {
        ...post,
        id: post._id.toString(),
        club: {
          name: club ? club.name : 'Unknown Club',
          logo_url: club ? club.logo_url : null
        },
        author: profile ? {
          full_name: profile.full_name || null,
          avatar_url: profile.avatar_url || null
        } : { error: true }
      };
    }));
    
    return { data: postsWithDetails, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getPostById(id: string) {
  await dbConnect();
  
  try {
    const post = await Post.findById(id).lean();
    
    if (!post) {
      return { data: null, error: 'Post not found' };
    }
    
    const club = await Club.findById(post.club_id).lean();
    const profile = await Profile.findOne({ user_id: post.author_id }).lean();
    
    const postWithDetails = {
      ...post,
      id: post._id.toString(),
      club: {
        name: club ? club.name : 'Unknown Club',
        logo_url: club ? club.logo_url : null
      },
      author: profile ? {
        full_name: profile.full_name || null,
        avatar_url: profile.avatar_url || null
      } : { error: true }
    };
    
    return { data: postWithDetails, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createPost(postData: any) {
  await dbConnect();
  
  try {
    const newPost = new Post(postData);
    const savedPost = await newPost.save();
    return { data: savedPost, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updatePost(id: string, postData: any) {
  await dbConnect();
  
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { ...postData, updated_at: new Date() },
      { new: true }
    );
    return { data: updatedPost, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deletePost(id: string) {
  await dbConnect();
  
  try {
    await Post.findByIdAndDelete(id);
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// More post-related functions as needed
