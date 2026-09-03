"use client";

import React, { useEffect, useState } from "react";

export const WebMCPStatusBadge = () => {
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const nav = navigator as any;
    const doc = document as any;
    const modelContext = doc.modelContext ?? nav.modelContext;
    
    if (modelContext && "registerTool" in modelContext) {
      setIsActive(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2 bg-background/80 backdrop-blur border border-primary/20 px-3 py-1.5 rounded-full shadow-sm">
      <div 
        className={`w-2 h-2 rounded-full ${
          isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"
        }`} 
      />
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
        {isActive ? "WebMCP Active" : "WebMCP Inactive"}
      </span>
    </div>
  );
};
