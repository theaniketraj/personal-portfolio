import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { WebMCPProvider } from "@/components/webmcp-provider";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk.ttf",
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theaniketraj.netlify.app"),
  title: {
    default:
      "Aniket Raj - Personal Portfolio | Software Engineer · Systems & AI",
    template: "%s | Aniket Raj",
  },
  description:
    "Personal Portfolio of Aniket Raj | Software Engineer · Systems & AI",
  openGraph: {
    title: "Aniket Raj | Software Engineer · Systems & AI",
    description:
      "Personal Portfolio of Aniket Raj | Software Engineer · Systems & AI",
    url: "https://theaniketraj.netlify.app",
    siteName: "Aniket Raj",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aniket Raj | Software Engineer · Systems & AI",
    description:
      "Personal Portfolio of Aniket Raj | Software Engineer · Systems & AI",
    creator: "@aniketfoundry",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://theaniketraj.netlify.app/#person",
        name: "Aniket Raj",
        alternateName: "Aniket Raj Portfolio",
        url: "https://theaniketraj.netlify.app/",
        image: "https://theaniketraj.netlify.app/icon.png",
        jobTitle: "Software Engineer",
        description:
          "Software & AI Engineer passionate about building innovative and scalable solutions.",
        nationality: "Indian",
        knowsAbout: [
          "Distributed Systems",
          "Software Architecture",
          "Systems Design",
          "Developer Tooling",
          "Web Development",
          "Frontend Development",
          "UI/UX Design",
          "Kotlin",
          "HTML",
          "CSS",
          "Python",
          "Java",
          "JavaScript",
          "TypeScript",
          "RESTful APIs",
          "MySQL",
          "Android",
          "AI",
          "Machine Learning",
        ],
        sameAs: [
          "https://github.com/theaniketraj",
          "https://leetcode.com/theaniketraj",
          "https://dev.to/theaniketraj",
          "https://x.com/aniketfoundry",
          "https://www.linkedin.com/in/theaniketraj/",
          "https://www.npmjs.com/~theaniketraj",
          "https://medium.com/@theaniketraj",
          "https://plugins.gradle.org/u/theaniketraj",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://theaniketraj.netlify.app/#website",
        url: "https://theaniketraj.netlify.app/",
        name: "Aniket Raj | Software Engineer · Systems & AI",
        alternateName: "Aniket Raj Portfolio",
        publisher: {
          "@id": "https://theaniketraj.netlify.app/#person",
        },
        inLanguage: "en",
        description:
          "Official portfolio website of Aniket Raj — Software & AI Engineer.",
      },
    ],
  };

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} ${spaceGrotesk.variable}`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <WebMCPProvider />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
