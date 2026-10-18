import { MetadataRoute } from 'next';
import { profileData } from '@/lib/content/profile';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${profileData.name} - Personal Portfolio`,
        short_name: profileData.name,
        description: profileData.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#0a0a0a',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ]
    };
}
