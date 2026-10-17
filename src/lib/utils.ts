import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Converts any tag string into a URL-safe, single-path-segment slug.
 * - Normalizes unicode characters
 * - Converts to lowercase
 * - Replaces non-alphanumeric characters (spaces, slashes, punctuation) with hyphens
 * - Collapses consecutive hyphens into a single hyphen
 * - Trims leading and trailing hyphens
 */
export function slugifyTag(tag: string): string {
    if (!tag) return '';
    return tag
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
