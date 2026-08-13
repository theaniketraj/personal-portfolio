"use client";

import * as React from "react";
import { MdxCopyButton } from "./mdx-copy-button";
import { cn } from "@/lib/utils";

export function MdxPre({
  children,
  className,
  ...props
}: React.ComponentProps<"pre">) {
  const preRef = React.useRef<HTMLPreElement>(null);
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    if (preRef.current) {
      // Get the raw text content of the code block
      setText(preRef.current.textContent || "");
    }
  }, []);

  // Extract data attributes to pass to the wrapper so CSS toggling works
  const dataProps = Object.keys(props).reduce(
    (acc, key) => {
      if (key.startsWith("data-")) {
        acc[key] = props[key as keyof typeof props];
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  return (
    <div className="relative group my-6 w-full" {...dataProps}>
      <div className="absolute right-3 top-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
        <MdxCopyButton text={text} />
      </div>
      <pre
        ref={preRef}
        className={cn(
          "p-4 rounded-xl overflow-x-auto font-mono text-sm border border-primary/10",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
