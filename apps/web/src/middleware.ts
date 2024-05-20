import { NextResponse, NextRequest } from 'next/server';

const protectedPages = ['/profile'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const url = request.nextUrl.pathname;
  if (protectedPages.includes(url)) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${url}`, request.url),
      );
    }
    return NextResponse.next();
  }
}
