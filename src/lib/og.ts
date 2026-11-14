import fs from 'node:fs';
import path from 'node:path';
import { getSiteUrl, profileData } from '@/lib/content/profile';

export interface BlogOgImageMeta {
    url: string;
    width: number;
    height: number;
    alt: string;
    type: string;
}

export interface ProjectOgImageMeta {
    url: string;
    alt: string;
    type: string;
}

// 2x Retina resolution for razor-sharp social previews on high-DPI screens and mobile devices
const DEFAULT_WIDTH = 2400;
const DEFAULT_HEIGHT = 1260;

/**
 * Returns metadata image descriptor for a blog post slug.
 * Statically constructs the canonical 2400x1260 (2x Retina) OG image URL with zero dynamic filesystem overhead.
 */
export function getBlogOgImage(slug?: string | null, fallbackTitle?: string): BlogOgImageMeta {
    const cleanSlug = slug?.trim();
    if (cleanSlug) {
        return {
            url: getSiteUrl(`/images/og/${cleanSlug}.png`),
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
            alt: fallbackTitle || `${cleanSlug} social preview`,
            type: 'image/png'
        };
    }

    return {
        url: getSiteUrl('/icon-512.png'),
        width: 512,
        height: 512,
        alt: fallbackTitle || profileData.name,
        type: 'image/png'
    };
}

const SUPPORTED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'svg'] as const;

const MIME_BY_EXTENSION: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    svg: 'image/svg+xml'
};

/**
 * Finds the matching project logo file on disk and returns its relative path and MIME type.
 */
function resolveProjectLogoAsset(slug: string): { relativePath: string; mimeType: string } {
    if (typeof process === 'undefined' || !process.cwd) {
        return { relativePath: `/project-logo/${slug}.png`, mimeType: 'image/png' };
    }

    const logoDir = path.join(process.cwd(), 'public', 'project-logo');
    for (const ext of SUPPORTED_EXTENSIONS) {
        if (fs.existsSync(path.join(logoDir, `${slug}.${ext}`))) {
            return {
                relativePath: `/project-logo/${slug}.${ext}`,
                mimeType: MIME_BY_EXTENSION[ext] || `image/${ext}`
            };
        }
    }

    return { relativePath: `/project-logo/${slug}.png`, mimeType: 'image/png' };
}

/**
 * Automatically discovers and maps the project logo from public/project-logo/{slug}.{ext}
 * serving the image directly as it is without resizing or letterboxing.
 */
export function getProjectOgImage(slug?: string | null, fallbackTitle?: string): ProjectOgImageMeta {
    const cleanSlug = slug?.trim();
    if (!cleanSlug) {
        return {
            url: getSiteUrl('/icon-512.png'),
            alt: fallbackTitle || profileData.name,
            type: 'image/png'
        };
    }

    const { relativePath, mimeType } = resolveProjectLogoAsset(cleanSlug);

    return {
        url: getSiteUrl(relativePath),
        alt: fallbackTitle || `${cleanSlug} project logo`,
        type: mimeType
    };
}
