
# MongoDB Integration for Cluby

This directory contains the MongoDB integration for the Cluby application. It includes database connection handling, models, and services for interacting with the database.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root of the project with the following variables:

```
# Option 1: Using a full connection string
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority

# OR Option 2: Using individual components
MONGODB_USERNAME=your_mongodb_username
MONGODB_PASSWORD=your_mongodb_password
MONGODB_CLUSTER=your_cluster.mongodb.net
MONGODB_DB_NAME=cluby
```

### 2. MongoDB Atlas Setup

1. Create a free MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Set up network access (IP whitelist) to allow your application to connect
5. Get your connection string from the Atlas UI

### 3. Models

The following models are available:

- `User` - User authentication information
- `Profile` - User profile information
- `Club` - Club information
- `Event` - Event information
- `Post` - Post information
- `Application` - Job application information
- `ClubMembership` - Club membership information
- `Recruitment` - Recruitment position information

### 4. Services

The following services are available:

- `eventService` - CRUD operations for events
- `postService` - CRUD operations for posts
- `clubService` - CRUD operations for clubs
- `membershipService` - CRUD operations for club memberships
- `recruitmentService` - CRUD operations for recruitment positions

## Usage in API Routes

```typescript
import { initMongoDB } from '@/lib/mongodb/init';
import { getEvents } from '@/lib/mongodb/services/eventService';

export async function GET(req: Request) {
  await initMongoDB();
  
  const { data, error } = await getEvents();
  
  if (error) {
    return new Response(JSON.stringify({ error }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({ data }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## Mock Data in Browser

The services automatically use mock data when running in the browser to facilitate development without requiring a database connection.
