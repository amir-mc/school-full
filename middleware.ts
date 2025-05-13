import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const user = await getCurrentUser() // اضافه کردن await

  // صفحاتی که نیاز به لاگین ندارند
  const publicPaths = ['/login', '/api/login']
  if (publicPaths.includes(pathname)) return

 if (!user && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}