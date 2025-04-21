
import { loginUser } from '@/lib/mongodb/services/authService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const result = await loginUser({ email, password });
    
    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 401, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Login API error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
