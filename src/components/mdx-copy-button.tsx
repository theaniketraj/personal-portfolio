"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  text: string;
}

export function MdxCopyButton({
  text,
  className,
  ...props
}: Readonly<CopyButtonProps>) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (hasCopied) {
      timeout = setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  const copyToClipboard = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  }, [text]);

  return (
    <button
      type="button"
      className={cn(
        "relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transition-colors",
        className,
      )}
      onClick={copyToClipboard}
      title="Copy code"
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
