
import { registerUser } from '@/lib/mongodb/services/authService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;
    
    if (!name || !email || !password || !role) {
      return new Response(
        JSON.stringify({ success: false, message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const result = await registerUser({ name, email, password, role });
    
    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 201 : 400, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Registration API error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
