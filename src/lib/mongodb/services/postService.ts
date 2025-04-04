
// This file provides mock data for client-side development
// In a real application, these functions would be API routes that connect to MongoDB

export async function createPost(postData: any) {
  console.log('Mocking post creation with data:', postData);
  return { 
    data: { id: 'mock-id', ...postData, created_at: new Date().toISOString() }, 
    error: null 
  };
}

export async function getPosts(query?: any) {
  console.log('Fetching mock posts with query:', query);
  
  // Return mock data for demonstration purposes
  return { 
    data: [
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
        },
        ui_status: undefined
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
        },
        ui_status: undefined
      }
    ], 
    error: null 
  };
}

export async function getAllPosts() {
  return getPosts();
}

export async function getPostById(postId: string) {
  console.log('Fetching mock post with ID:', postId);
  const { data } = await getPosts();
  const post = data.find((p: any) => p.id === postId);
  return { data: post || null, error: post ? null : 'Post not found' };
}

export async function updatePost(postId: string, postData: any) {
  console.log('Mocking post update with ID:', postId, 'and data:', postData);
  return { data: { id: postId, ...postData, updated_at: new Date().toISOString() }, error: null };
}

export async function deletePost(postId: string) {
  console.log('Mocking post deletion with ID:', postId);
  return { data: { id: postId, deleted: true }, error: null };
}

export async function getPostsByClubId(clubId: string) {
  console.log('Fetching mock posts for club ID:', clubId);
  const { data } = await getPosts();
  const filteredPosts = data.filter((post: any) => post.club_id === clubId);
  return { data: filteredPosts, error: null };
}

export async function getPostsByAuthorId(authorId: string) {
  console.log('Fetching mock posts for author ID:', authorId);
  const { data } = await getPosts();
  const filteredPosts = data.filter((post: any) => post.author_id === authorId);
  return { data: filteredPosts, error: null };
}
