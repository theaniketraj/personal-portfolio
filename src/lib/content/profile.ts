import type { Metadata } from 'next';

export interface Profile {
    name: string;
    role: string;
    title: string;
    description: string;
    focus: string[];
    location: string;
    resumeUrl: string;
    url: string;
    links: {
        github: string;
        linkedin: string;
        twitter?: string;
    };
}

export const profileData: Profile = {
    name: 'Aniket Raj',
    role: 'Software Engineer',
    title: 'Software Engineer · Systems & AI',
    description: 'Software Engineer focused on systems, applied AI, developer tooling, and reliable software.',
    focus: ['systems', 'AI', 'developer tooling'],
    location: 'India',
    resumeUrl: 'https://theaniketraj.github.io/vitae',
    url: 'https://theaniketraj.netlify.app',
    links: {
        github: 'https://github.com/theaniketraj',
        linkedin: 'https://linkedin.com/in/theaniketraj',
        twitter: 'https://x.com/aniketfoundry'
    }
};

export function getProfile(): Profile {
    return profileData;
}

export function getSiteUrl(path: string = ''): string {
    if (!path) return profileData.url;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${profileData.url}${cleanPath}`;
}

export type OpenGraph = NonNullable<Metadata['openGraph']>;

export function createOpenGraph(overrides: Partial<OpenGraph> = {}): OpenGraph {
    return {
        siteName: profileData.name,
        locale: 'en_US',
        type: 'website',
        ...overrides
    };
}
