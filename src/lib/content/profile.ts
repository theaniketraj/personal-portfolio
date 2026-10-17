export interface Profile {
    name: string;
    role: string;
    title: string;
    description: string;
    focus: string[];
    location: string;
    resumeUrl: string;
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
    links: {
        github: 'https://github.com/theaniketraj',
        linkedin: 'https://linkedin.com/in/theaniketraj',
        twitter: 'https://x.com/aniketfoundry'
    }
};

export function getProfile(): Profile {
    return profileData;
}
