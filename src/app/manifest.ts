import { MetadataRoute } from 'next';
import { profileData } from '@/lib/content/profile';

export default function manifest(): MetadataRoute.Manifest {
    return {
        id: '/?source=pwa',
        name: `${profileData.name} - Personal Portfolio | ${profileData.title}`,
        short_name: profileData.name,
        description: profileData.description,
        start_url: '/?source=pwa',
        scope: '/',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui', 'browser'],
        orientation: 'portrait-primary',
        background_color: '#0a0a0a',
        theme_color: '#0a0a0a',
        lang: 'en-US',
        dir: 'ltr',
        categories: ['portfolio', 'technology', 'developer', 'education', 'productivity'],
        icons: [
            // Standard icons
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/icon-maskable-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/icon-maskable-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            },
            // iPhone & Apple touch icon support
            {
                src: '/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/apple-touch-icon-180x180.png',
                sizes: '180x180',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/apple-touch-icon-167x167.png',
                sizes: '167x167',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/apple-touch-icon-152x152.png',
                sizes: '152x152',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/apple-touch-icon-120x120.png',
                sizes: '120x120',
                type: 'image/png',
                purpose: 'any'
            }
        ],
        screenshots: [
            {
                src: '/screenshots/iphone-portrait.png',
                sizes: '750x1334',
                type: 'image/png',
                form_factor: 'narrow',
                platform: 'ios',
                label: `${profileData.name} - Mobile Portfolio on iPhone`
            },
            {
                src: '/screenshots/desktop-wide.png',
                sizes: '1280x720',
                type: 'image/png',
                form_factor: 'wide',
                platform: 'macos',
                label: `${profileData.name} - Engineering Portfolio & Systems Architecture`
            }
        ],
        shortcuts: [
            {
                name: 'Explore Projects',
                short_name: 'Projects',
                description: 'View full-stack architecture and systems case studies',
                url: '/projects?source=pwa',
                icons: [
                    {
                        src: '/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    }
                ]
            },
            {
                name: 'Engineering Blog',
                short_name: 'Articles',
                description: 'Read technical articles and architecture breakdowns',
                url: '/blog?source=pwa',
                icons: [
                    {
                        src: '/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    }
                ]
            },
            {
                name: 'AI Agents & CLI',
                short_name: 'Agents',
                description: 'Interactive portfolio command-line interface and WebMCP tools',
                url: '/agents?source=pwa',
                icons: [
                    {
                        src: '/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    }
                ]
            }
        ],
        prefer_related_applications: false,
        related_applications: []
    };
}
