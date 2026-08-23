"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Use a small timeout to ensure MDX has fully rendered to DOM
    const timer = setTimeout(() => {
      const elements = Array.from(
        document.querySelectorAll(".mdx-content h2, .mdx-content h3"),
      );

      const parsedHeadings: Heading[] = elements
        .map((elem) => {
          // Some headers might have embedded go-to tags or links, we just want the pure text
          const text =
            elem.textContent?.replace(/Project Resources/i, "").trim() || "";
          return {
            id: elem.id,
            text: text,
            level: Number(elem.tagName.replace("H", "")),
          };
        })
        .filter((h) => h.id && h.text);

      setHeadings(parsedHeadings);

      // We'll track all heading elements and see which one is intersecting
      const observerCallback: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, {
        // Trigger when the heading reaches the top 20% of the viewport
        rootMargin: "-20% 0px -80% 0px",
      });

      elements.forEach((elem) => observer.observe(elem));

      // Set initial active ID if we have headings
      if (elements.length > 0 && !window.location.hash) {
        // Just default to first one if at top
        const firstId = elements[0].id;
        setActiveId(firstId);
      }

      return () => observer.disconnect();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

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
