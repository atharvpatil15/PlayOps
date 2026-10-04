import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { ROUTES } from "@/lib/constants/routes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { supabaseResponse, user, role } = await updateSession(request);

  // 1. Auth routes (login/register) - redirect to relevant dashboard if already logged in
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  if (isAuthRoute && user) {
    if (role === "admin") {
      return NextResponse.redirect(new URL(ROUTES.ADMIN_DASHBOARD, request.url));
    }
    return NextResponse.redirect(new URL(ROUTES.PLAYER_DASHBOARD, request.url));
  }

  // 2. Protected Admin routes
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) {
    if (!user) {
      const redirectUrl = new URL(ROUTES.LOGIN, request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL(ROUTES.PLAYER_DASHBOARD, request.url));
    }
  }

  // 3. Protected Player routes
  const isPlayerRoute = pathname.startsWith("/player") || pathname.startsWith("/dashboard");
  if (isPlayerRoute) {
    if (!user) {
      const redirectUrl = new URL(ROUTES.LOGIN, request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons, and static assets
     */
    "/((?!_next/static|_next/image|favicon.ico|images|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
