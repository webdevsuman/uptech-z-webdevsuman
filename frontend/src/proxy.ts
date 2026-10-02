import { NextRequest, NextResponse } from "next/server";
import { accessTokenName } from "./config/constants";

const authRoutes = [
  "/login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
];

export function proxy(req: NextRequest) {
  const token = req.cookies.get(accessTokenName)?.value;
  const { pathname, search, searchParams } = req.nextUrl;

  const isAuthPath = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedPath =
    pathname.startsWith("/instructor") || pathname.startsWith("/student");

  const makeURL = (path: string) => new URL(path, req.url);

  // 1. Unauthenticated users
  if (!token) {
    if (isProtectedPath) {
      const loginUrl = makeURL("/login");
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Authenticated users visiting auth routes
  if (isAuthPath) {
    const callbackUrl = searchParams.get("callbackUrl");
    if (callbackUrl) {
      return NextResponse.redirect(makeURL(decodeURIComponent(callbackUrl)));
    }
    // Default redirect for authenticated users visiting login/signup
    return NextResponse.redirect(makeURL("/instructor/dashboard"));
  }

  // 3. Authenticated users proceeding to requested route
  const cb = searchParams.get("callbackUrl");
  if (cb) {
    return NextResponse.redirect(makeURL(decodeURIComponent(cb)));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/instructor/:path*",
    "/student/:path*",
    "/login",
    "/register",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
  ],
};
