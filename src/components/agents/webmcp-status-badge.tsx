"use client";

import { useEffect, useState } from "react";
export const WebMCPStatusBadge = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const doc = document as unknown as { modelContext?: any };

    if (doc.modelContext) {
      setIsSupported(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur border border-primary/20 px-3 py-1.5 rounded-full shadow-sm">
        <div
          className={`w-2 h-2 rounded-full ${
            isSupported ? "bg-emerald-500 animate-pulse" : "bg-red-500"
          }`}
        />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {isSupported ? "Supported" : "Unavailable"}
        </span>
      </div>
    </div>
  );
};
