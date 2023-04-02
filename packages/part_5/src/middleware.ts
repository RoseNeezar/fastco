import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { env } from "./env.mjs";

export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname;

  const session = await getToken({
    req,
    secret: env.NEXTAUTH_SECRET,
  });

  const isAuthRoute = path === "/auth/login" || path === "/auth/register";

  if (!session && path.includes("/app")) {
    return NextResponse.redirect(
      new URL("/auth/login?callbackUrl=" + path, req.url)
    );
  } else if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/auth/login", "/auth/register"],
};
