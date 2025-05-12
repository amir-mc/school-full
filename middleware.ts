// src/middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // اگر کاربر لاگین نکرده و می‌خواهد به صفحات حفاظت شده دسترسی پیدا کند
  if (!session && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // اگر کاربر لاگین کرده و می‌خواهد به صفحه لاگین برود
  if (session && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // کنترل دسترسی بر اساس نقش‌ها
  if (session) {
    if (pathname.startsWith("/admin") && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    
    if (pathname.startsWith("/teacher") && session.user.role !== "TEACHER") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    
    // کنترل‌های دیگر...
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};