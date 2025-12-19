import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl

  // If user is not authenticated
  if (!token) {
    // Allow access to public pages
    if (pathname === '/' || pathname.startsWith('/auth')) {
      return NextResponse.next()
    }
    // Redirect to signin for protected routes
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // If user is authenticated
  const userRole = token.role as string

  // Dashboard - only for farmers
  if (pathname.startsWith('/dashboard')) {
    if (userRole !== 'FARMER') {
      return NextResponse.redirect(new URL('/marketplace', request.url))
    }
  }

  // Marketplace - accessible to all authenticated users
  if (pathname.startsWith('/marketplace')) {
    return NextResponse.next()
  }

  // Redirect authenticated users
  if (pathname === '/auth/signin' || pathname === '/auth/signup') {
    // Redirect farmers to dashboard, others to marketplace
    const redirectPath = userRole === 'FARMER' ? '/dashboard' : '/marketplace'
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/marketplace/:path*', '/auth/:path*'],
}
