"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heading } from "@/lib/toc";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: Readonly<TableOfContentsProps>) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    // Use IntersectionObserver directly on the known IDs
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-20% 0px -80% 0px",
    });

    headings.forEach((heading) => {
      const elem = document.getElementById(heading.id);
      if (elem) observer.observe(elem);
    });

    if (!window.location.hash) {
      setActiveId(headings[0].id);
    }

    return () => observer.disconnect();
  }, [headings]);

  // Auto-scroll the TOC container so the active item is always visible
  useEffect(() => {
    if (activeId) {
      const activeLink = document.getElementById(`toc-link-${activeId}`);
      if (activeLink) {
        activeLink.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [activeId]);

  if (headings.length === 0) return null;

  return (
    <nav className="group relative flex flex-col items-end gap-3 py-4 pl-4 pr-2 bg-background max-h-[70vh] overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
      {headings.map((heading) => {
        const isActive = activeId === heading.id;
        const isSubheading = heading.level > 2;

        return (
          <Link
            key={heading.id}
            id={`toc-link-${heading.id}`}
            href={`#${heading.id}`}
            className="flex items-center justify-end h-5 cursor-pointer shrink-0"
            aria-label={heading.text}
          >
            {/* The text revealed on hover (expands to the left) */}
            <span
              className={`mr-4 overflow-hidden max-w-0 opacity-0 group-hover:max-w-70 group-hover:opacity-100 transition-all duration-500 ease-out whitespace-nowrap text-sm text-right ${
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {heading.text}
            </span>

            {/* The line (strip) on the right edge */}
            <div
              className={`h-0.5 rounded-full transition-all duration-300 shrink-0 ${
                isActive
                  ? "w-6 bg-primary shadow-[0_0_8px_rgba(28,33,43,0.5)] dark:shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                  : "w-4 bg-primary/20 group-hover:bg-primary/40"
              } ${isSubheading ? "mr-3" : ""}`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
