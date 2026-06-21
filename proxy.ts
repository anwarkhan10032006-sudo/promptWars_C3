import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  
  // Check if session ID cookie is already present
  const sessionId = request.cookies.get('verdance_session_id')?.value;
  
  if (!sessionId) {
    // Generate a secure UUID for the session
    const newSessionId = crypto.randomUUID();
    
    // Set cookie on response
    response.cookies.set('verdance_session_id', newSessionId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365 // 1 year expiry
    });
  }
  
  return response;
}

// Only match app routes, skip static resources and API calls that don't need sessions
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
