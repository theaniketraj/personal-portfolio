import type { Metadata } from 'next';
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
import { profileData } from '@/lib/content/profile';

const inter = Inter({
    variable: '--font-inter-sans',
    subsets: ['latin']
});

const spaceGrotesk = localFont({
    src: './fonts/SpaceGrotesk.ttf',
    variable: '--font-space-grotesk',
    display: 'swap'
});

export const metadata: Metadata = {
    metadataBase: new URL('https://theaniketraj.netlify.app'),
    title: {
        default: `${profileData.name} - Personal Portfolio | ${profileData.title}`,
        template: `%s | ${profileData.name}`
    },
    description: profileData.description,
    openGraph: {
        title: `${profileData.name} | ${profileData.title}`,
        description: profileData.description,
        url: 'https://theaniketraj.netlify.app',
        siteName: profileData.name,
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://theaniketraj.netlify.app/icon-512.png',
                width: 512,
                height: 512,
                alt: `${profileData.name} | ${profileData.title}`
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: `${profileData.name} | ${profileData.title}`,
        description: profileData.description,
        creator: '@aniketfoundry',
        images: ['https://theaniketraj.netlify.app/icon-512.png']
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
                '@id': 'https://theaniketraj.netlify.app/#person',
                name: profileData.name,
                alternateName: `${profileData.name} Portfolio`,
                url: 'https://theaniketraj.netlify.app/',
                image: 'https://theaniketraj.netlify.app/icon-512.png',
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
                '@id': 'https://theaniketraj.netlify.app/#website',
                url: 'https://theaniketraj.netlify.app/',
                name: `${profileData.name} | ${profileData.title}`,
                alternateName: `${profileData.name} Portfolio`,
                publisher: {
                    '@id': 'https://theaniketraj.netlify.app/#person'
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
