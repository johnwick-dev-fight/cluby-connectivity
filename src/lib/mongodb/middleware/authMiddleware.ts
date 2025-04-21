
import { getUserByToken } from '@/lib/mongodb/services/authService';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function authMiddleware(req: AuthenticatedRequest): Promise<Response | null> {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ success: false, message: 'Unauthorized: No token provided' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  const token = authHeader.split(' ')[1];
  const result = await getUserByToken(token);
  
  if (!result.success) {
    return new Response(
      JSON.stringify({ success: false, message: 'Unauthorized: Invalid token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Add user to request
  req.user = result.user;
  
  // Return null to continue to the next middleware or handler
  return null;
}

export async function adminMiddleware(req: AuthenticatedRequest): Promise<Response | null> {
  // First apply auth middleware
  const authResponse = await authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }
  
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return new Response(
      JSON.stringify({ success: false, message: 'Forbidden: Admin access required' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Return null to continue to the next middleware or handler
  return null;
}

export async function clubRepMiddleware(req: AuthenticatedRequest): Promise<Response | null> {
  // First apply auth middleware
  const authResponse = await authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }
  
  // Check if user is club representative
  if (req.user.role !== 'clubRepresentative') {
    return new Response(
      JSON.stringify({ success: false, message: 'Forbidden: Club representative access required' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Return null to continue to the next middleware or handler
  return null;
}
