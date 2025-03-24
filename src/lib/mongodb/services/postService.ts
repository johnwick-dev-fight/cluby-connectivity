
// This file should be used in API routes only.
// Since we're doing client-side authentication for now,
// we'll leave this as a placeholder.

export async function createPost(postData: any) {
  console.warn('Server-side function called from client');
  return { data: null, error: null };
}

export async function getAllPosts() {
  console.warn('Server-side function called from client');
  
  // Return mock data for demonstration purposes
  return { 
    data: [
      {
        _id: '1',
        title: 'Welcome to Cluby',
        content: 'Join us for the kickoff meeting of the new semester!',
        club_id: '1',
        author_id: '1',
        created_at: new Date(),
        updated_at: new Date(),
        club: {
          _id: '1',
          name: 'Programming Club',
          logo_url: '/avatar-placeholder.jpg'
        },
        author: {
          _id: '1',
          full_name: 'John Doe',
          avatar_url: '/avatar-placeholder.jpg'
        }
      },
      {
        _id: '2',
        title: 'Photography Contest',
        content: 'Submit your best shots for a chance to win prizes!',
        club_id: '2',
        author_id: '2',
        created_at: new Date(),
        updated_at: new Date(),
        club: {
          _id: '2',
          name: 'Photography Club',
          logo_url: '/avatar-placeholder.jpg'
        },
        author: {
          _id: '2',
          full_name: 'Jane Smith',
          avatar_url: '/avatar-placeholder.jpg'
        }
      }
    ], 
    error: null 
  };
}

export async function getPostById(postId: string) {
  console.warn('Server-side function called from client');
  return { data: null, error: null };
}

export async function updatePost(postId: string, postData: any) {
  console.warn('Server-side function called from client');
  return { data: null, error: null };
}

export async function deletePost(postId: string) {
  console.warn('Server-side function called from client');
  return { data: null, error: null };
}

export async function getPostsByClubId(clubId: string) {
  console.warn('Server-side function called from client');
  return { data: [], error: null };
}

export async function getPostsByAuthorId(authorId: string) {
  console.warn('Server-side function called from client');
  return { data: [], error: null };
}
