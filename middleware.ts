// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // อนุญาตเสมอ: ไฟล์สาธารณะ และเส้นทาง auth เอง
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/assets") ||
    pathname === "/"
  ) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // ต้องล็อกอินเพื่อเข้า /dashboard
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // ต้องเป็น admin เพื่อเข้า /admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    // ถ้าใช้ TS และยังไม่ได้ augment type ของ JWT ให้ cast ชั่วคราว
    const role = (token as any)?.role
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // จับเฉพาะเส้นทางที่ต้องป้องกัน
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
