// src/proxy.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role as number | undefined;

  // ─── กำหนด route แต่ละประเภท ───
  const publicRoutes = ["/login"];
  const userRoutes = ["/satisfaction", "/dashboard"];
  const adminRoutes = ["/usermanager", "/groupmanager"];

  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));
  const isUserRoute = userRoutes.some((r) => pathname.startsWith(r));
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));

  // ─── ยังไม่ได้ login ───
  if (!isLoggedIn) {
    if (isUserRoute || isAdminRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // ─── Login แล้ว แต่มาที่ /login → ไป satisfaction ───
  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL("/satisfaction", req.url));
  }

  // ─── Login แล้ว แต่ไม่ใช่ Admin พยายามเข้า admin route ───
  if (isAdminRoute && userRole !== 2) {
    return NextResponse.redirect(new URL("/satisfaction", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};