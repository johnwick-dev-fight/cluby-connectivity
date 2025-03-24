// This file is meant to only be used in API routes, not in the browser.
// However, since we're simulating a client-side authentication flow,
// we'll leave this as a placeholder for now.

export interface AuthResponse {
  user: any;
  session: {
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
  } | null;
  error?: Error;
}

// Note: These functions are placeholders and would normally
// make server-side API calls to handle authentication.
// Do not use this directly in client-side code.

export async function signUp(email: string, password: string, userData: any): Promise<AuthResponse> {
  console.warn('Attempted to call server-side function from client');
  return {
    user: null,
    session: null,
    error: new Error('This function is meant to be used in API routes only')
  };
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  console.warn('Attempted to call server-side function from client');
  return {
    user: null,
    session: null,
    error: new Error('This function is meant to be used in API routes only')
  };
}

export async function getUserProfile(userId: string) {
  console.warn('Attempted to call server-side function from client');
  return null;
}

export async function verifyToken(token: string) {
  console.warn('Attempted to call server-side function from client');
  return { data: null, error: new Error('This function is meant to be used in API routes only') };
}

export async function signOut() {
  console.warn('Attempted to call server-side function from client');
  return { error: null };
}
