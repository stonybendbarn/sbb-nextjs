import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if this is an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }
    
    // Check for admin session cookie
    const adminSession = request.cookies.get('admin-session')
    console.log('🔍 Middleware check:', {
      path: request.nextUrl.pathname,
      hasCookie: !!adminSession,
      cookieValue: adminSession?.value?.substring(0, 10) + '...'
    })
    
    if (!adminSession) {
      console.log('❌ No admin session cookie, redirecting to login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // Verify the session
    const expectedSession = process.env.ADMIN_SESSION_SECRET
    if (adminSession.value !== expectedSession) {
      console.log('❌ Invalid session, redirecting to login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    console.log('✅ Admin session valid, allowing access')
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
