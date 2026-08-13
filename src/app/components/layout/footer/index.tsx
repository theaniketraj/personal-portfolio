import Link from "next/link";

const Footer = () => {
  return (
    <footer className="-translate-y-px bg-background border-t border-primary/10">
      <div className="container">
        <div className="border-x border-primary/10">
          <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-start gap-x-6 sm:gap-x-8 gap-y-4 px-4 sm:px-7 py-8">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
