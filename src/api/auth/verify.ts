
import { getUserByToken } from '@/lib/mongodb/services/authService';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, message: 'No token provided' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.split(' ')[1];
    const result = await getUserByToken(token);
    
    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 401, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Token verification API error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
