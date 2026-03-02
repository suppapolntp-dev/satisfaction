// src/proxy.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// route → permission key ที่ต้องมี
const PROTECTED: Record<string, string> = {
  "/dashboard":    "canViewDashboard",
  "/satisfaction": "canViewSatisfaction",
  "/usermanager":  "canManageUser",
  "/rolemanager":  "canManageRole",
  "/brandmanager": "canManageBrand",
  "/branchmanager":"canManageBranch",
  "/areamanager":  "canManageArea",
};

// route ที่ public (ไม่ต้อง login)
const PUBLIC = ["/login"];

// route ที่รู้จัก (ไม่ redirect ว่าไม่รู้จัก)
const KNOWN = [...PUBLIC, ...Object.keys(PROTECTED)];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn   = !!req.auth;
  const user         = req.auth?.user as Record<string, unknown> | undefined;

  // ── ยังไม่ได้ login ──
  if (!isLoggedIn) {
    if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ── Login แล้ว → อยู่ที่ /login ไป /dashboard ──
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isKnown = KNOWN.some((r) => pathname.startsWith(r));
  if (!isKnown) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const matchedRoute = Object.keys(PROTECTED).find((r) => pathname.startsWith(r));
  if (matchedRoute) {
    const permKey = PROTECTED[matchedRoute];
    const hasPerm = Number(user?.[permKey] ?? 0) === 1;
    if (!hasPerm) return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // ยกเว้น api, static files, images
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};