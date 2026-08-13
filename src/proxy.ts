import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // 1. Security Headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
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
  } else {
    // Dynamic page revalidation
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
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
