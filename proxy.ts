import { NextResponse, type NextRequest } from "next/server";
import { getCookieCache, getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  // NOTE: this is an OPTIMISTIC redirect only. getSessionCookie checks cookie
  // EXISTENCE, not validity — anyone can forge a cookie. Every protected page
  // and every mutation MUST still call getSession() server-side (see
  // src/lib/session.ts). Never treat this check as authorization.
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  // Role lookup via the signed cookie cache (no DB hit). Falls back to
  // "user" when the cache is missing (e.g. signed in before cookieCache
  // was enabled) — the server-side requireAdmin() guard re-validates.
  let role: string | null | undefined = null;
  try {
    const cache = await getCookieCache(request, {
      secret: process.env.BETTER_AUTH_SECRET,
    });
    role = cache?.user.role ?? null;
  } catch {
    role = null;
  }

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin/dashboard" : "/dashboard", request.url)
    );
  }

  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  if (isDashboardRoute && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/admin/:path*", "/account/:path*"],
};
