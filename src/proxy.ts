import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // 1. Security Headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';",
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );

  // 2. SEO & Robots Headers
  response.headers.set("X-Robots-Tag", "index, follow");

  // 3. Performance & Asset Caching Rules
  const isStaticAsset =
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/images/") ||
    /\.(svg|png|jpg|jpeg|webp|gif|ico|woff|woff2|ttf|eot)$/i.test(pathname);

  if (isStaticAsset) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable",
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (/api/*)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    "/((?!api|_next/image|favicon.ico).*)",
  ],
};
