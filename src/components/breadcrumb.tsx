import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  backHref: string;
  backLabel: string;
}

export function Breadcrumb({
  items,
  backHref,
  backLabel,
}: Readonly<BreadcrumbProps>) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-nowrap whitespace-nowrap items-center gap-2.5"
    >
      {/* Interactive Back Pill */}
      <Link
        href={backHref}
        aria-label={`Go back to ${backLabel}`}
        className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/15 bg-primary/5 hover:bg-primary/10 text-primary font-mono text-xs font-medium transition-all shadow-2xs shrink-0"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
        <span>{backLabel}</span>
      </Link>

      <ChevronRight className="w-3.5 h-3.5 text-primary/30 shrink-0" />

      {/* Path Items */}
      <div className="flex items-center gap-2 overflow-hidden">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-primary/30 shrink-0" />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-secondary hover:text-primary font-medium text-xs sm:text-sm transition-colors shrink-0"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current="page"
                  className="text-primary font-medium text-xs sm:text-sm truncate inline-block max-w-[140px] sm:max-w-[200px] md:max-w-[250px] shrink-0"
                >
                  {item.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
