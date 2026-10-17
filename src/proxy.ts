import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const response = NextResponse.next();
    const { pathname } = request.nextUrl;

    // 1. Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';"
    );
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

    // 2. Performance & Asset Classification
    const isStaticAsset =
        pathname.startsWith('/_next/static/') ||
        pathname.startsWith('/images/') ||
        /\.(svg|png|jpg|jpeg|webp|gif|ico|woff|woff2|ttf|eot)$/i.test(pathname);

    // 3. SEO & Robots Headers (aligned with route-level metadata)
    const cleanPath = pathname.replace(/\/$/, '');
    const isNoIndexRoute =
        cleanPath.startsWith('/projects/tags/') ||
        cleanPath === '/projects/tags' ||
        cleanPath.startsWith('/blog/tags/') ||
        cleanPath === '/blog/tags' ||
        cleanPath === '/projects/deprecated';

    if (isNoIndexRoute) {
        response.headers.set('X-Robots-Tag', 'noindex, follow');
    } else if (!isStaticAsset) {
        response.headers.set('X-Robots-Tag', 'index, follow');
    }

    // 4. Performance & Asset Caching Rules

    if (isStaticAsset) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
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
        '/((?!api|_next/image|favicon.ico).*)'
    ]
};
