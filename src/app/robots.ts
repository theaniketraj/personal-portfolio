import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/content/profile';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/'
        },
        sitemap: getSiteUrl('/sitemap.xml')
    };
}
