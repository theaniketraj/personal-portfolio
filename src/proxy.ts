import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { slugifyTag } from '@/lib/utils';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 0. Generic Tag Route Normalization
    // Replaces slashes in tag URL paths with dashes to support multi-segment tag URLs
    // (e.g. /projects/tags/ci/cd -> /projects/tags/ci-cd, /blog/tags/ui/ux -> /blog/tags/ui-ux)
    const tagMatch = new RegExp(/^\/(projects|blog)\/tags\/(.+)$/).exec(pathname);
    if (tagMatch) {
        const [, section, rawTag] = tagMatch;
        const trimmedTag = rawTag.replace(/\/+$/, '');
        if (trimmedTag.includes('/')) {
            const normalizedSlug = slugifyTag(trimmedTag);
            if (normalizedSlug) {
                const targetUrl = new URL(`/${section}/tags/${normalizedSlug}`, request.url);
                return NextResponse.redirect(targetUrl, 308);
            }
        }
    }

    const response = NextResponse.next();

    // 1. Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://*.netlify.app;"
    );
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

    // 2. Performance & Asset Classification
    const isFingerprintedAsset = pathname.startsWith('/_next/static/');
    const isPublicStaticAsset =
        pathname.startsWith('/images/') ||
        pathname.startsWith('/fonts/') ||
        /\.(svg|png|jpg|jpeg|webp|gif|ico|woff|woff2|ttf|eot)$/i.test(pathname);
    const isStaticAsset = isFingerprintedAsset || isPublicStaticAsset;

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
    if (isFingerprintedAsset) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (isPublicStaticAsset) {
        response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - api routes (/api or /api/*)
         * - _next/image (image optimization files)
         * - favicon.ico
         */
        '/((?!api(?:/|$)|_next/image|favicon.ico).*)'
    ]
};
