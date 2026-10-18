import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Header from './components/layout/header';
import Footer from './components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { RouteBorderBeam } from '@/components/animations/route-border-beam';
import { WebMCPProvider } from '@/components/webmcp-provider';
import { ContactDraftProvider } from '@/components/contact-draft-context';
import { getProjects, getBlogPosts } from '@/lib/mdx';
import { profileData, getSiteUrl, createOpenGraph } from '@/lib/content/profile';

const inter = Inter({
    variable: '--font-inter-sans',
    subsets: ['latin']
});

const spaceGrotesk = localFont({
    src: './fonts/SpaceGrotesk.ttf',
    variable: '--font-space-grotesk',
    display: 'swap'
});

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
    ]
};

export const metadata: Metadata = {
    metadataBase: new URL(getSiteUrl()),
    title: {
        default: `${profileData.name} - Personal Portfolio | ${profileData.title}`,
        template: `%s | ${profileData.name}`
    },
    description: profileData.description,
    openGraph: createOpenGraph({
        title: `${profileData.name} | ${profileData.title}`,
        description: profileData.description,
        url: getSiteUrl(),
        images: [
            {
                url: getSiteUrl('/icon-512.png'),
                width: 512,
                height: 512,
                alt: `${profileData.name} | ${profileData.title}`
            }
        ]
    }),
    twitter: {
        card: 'summary_large_image',
        title: `${profileData.name} | ${profileData.title}`,
        description: profileData.description,
        creator: '@aniketfoundry',
        images: [getSiteUrl('/icon-512.png')]
    }
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                '@id': `${profileData.url}/#person`,
                name: profileData.name,
                alternateName: `${profileData.name} Portfolio`,
                url: getSiteUrl('/'),
                image: getSiteUrl('/icon-512.png'),
                jobTitle: profileData.role,
                description: profileData.description,
                nationality: 'Indian',
                knowsAbout: [
                    'Systems Programming',
                    'Distributed Systems',
                    'Software Architecture',
                    'Developer Tooling',
                    'Applied AI',
                    'Android Development'
                ],
                sameAs: [
                    profileData.links.github,
                    profileData.links.twitter,
                    profileData.links.linkedin,
                    'https://leetcode.com/theaniketraj',
                    'https://dev.to/theaniketraj',
                    'https://www.npmjs.com/~theaniketraj',
                    'https://medium.com/@theaniketraj',
                    'https://plugins.gradle.org/u/theaniketraj'
                ]
            },
            {
                '@type': 'WebSite',
                '@id': `${profileData.url}/#website`,
                url: getSiteUrl('/'),
                name: `${profileData.name} | ${profileData.title}`,
                alternateName: `${profileData.name} Portfolio`,
                publisher: {
                    '@id': `${profileData.url}/#person`
                },
                inLanguage: 'en',
                description: profileData.description
            }
        ]
    };

    const projectsMeta = getProjects();
    const articlesMeta = getBlogPosts();

    return (
        <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
            <body className={`${inter.className} ${spaceGrotesk.variable}`} suppressHydrationWarning>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
                    <a
                        href="#main-content"
                        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:border focus:border-border focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        Skip to main content
                    </a>
                    <ContactDraftProvider>
                        <Header />
                        {children}
                        <WebMCPProvider
                            profileData={profileData}
                            projectsMeta={projectsMeta}
                            articlesMeta={articlesMeta}
                        />
                        <Footer />
                        <RouteBorderBeam />
                    </ContactDraftProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
