"use client";

import React from "react";
import Link from "next/link";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="-translate-y-px bg-background border-t border-primary/10">
      <div className="container">
        <div className="border-x border-primary/10">
          <div className="max-w-3xl mx-auto flex flex-col gap-10 sm:gap-14 px-4 sm:px-7 py-12 sm:py-16">
            {/* Top: Header */}
            <div className="flex flex-col text-2xl sm:text-3xl font-medium tracking-tight">
              <span className="text-primary">BUILT WITH CURIOSITY.</span>
              <span className="text-muted-foreground">
                ENGINEERED WITH INTENT.
              </span>
            </div>

            {/* Middle: Links and Icons */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-10">
              {/* Left: Navigation Links */}
              <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-4">
                <Link
                  href="https://theaniketraj.github.io/vitae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-block text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                >
                  CV
                  <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
                <Link
                  href="mailto:theaniketraj@hotmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-block text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                >
                  Contact
                  <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
                <Link
                  href="/blog"
                  className="group relative inline-block text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                >
                  Blog
                  <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
                <Link
                  href="https://lexumhq.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-block text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                >
                  Lexum
                  <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
                <Link
                  href="https://versenova.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-block text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
                >
                  Versenova
                  <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              </div>

              {/* Right: Social Handle Hover Component */}
              <div className="group flex items-center">
                <div className="flex items-center gap-4 text-muted-foreground transition-all duration-500 ease-out group-hover:scale-95 group-hover:-translate-x-1 origin-right">
                  <Link
                    href="https://github.com/theaniketraj"
                    target="_blank"
                    aria-label="GitHub"
                    className="hover:text-primary transition-colors"
                  >
                    <GithubIcon className="w-5 h-5" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/theaniketraj/"
                    target="_blank"
                    aria-label="LinkedIn"
                    className="hover:text-primary transition-colors"
                  >
                    <LinkedinIcon className="w-5 h-5" />
                  </Link>
                </div>

                <div className="flex items-center text-muted-foreground overflow-hidden whitespace-nowrap transition-all duration-500 ease-out max-w-0 opacity-0 group-hover:max-w-50 group-hover:opacity-100 pl-2">
                  <span className="mr-1.5 font-light text-primary/40">/</span>
                  <span className="font-medium tracking-wide text-sm text-primary">
                    @theaniketraj
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom: Copyright & Back to Top */}
            <div className="flex items-center justify-between gap-4 pt-10 border-t border-primary/10">
              <p className="text-sm font-medium text-muted-foreground">
                &copy; 2026 Aniket Raj
              </p>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="group-hover:-translate-y-1 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12 7-7 7 7" />
                    <path d="M12 19V5" />
                  </svg>
                </span>
                BACK TO TOP
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
