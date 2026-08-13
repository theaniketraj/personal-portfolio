"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9.5 h-9.5 sm:w-11.5 sm:h-11.5 rounded-full border border-primary/10 flex items-center justify-center p-2.5 opacity-50" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9.5 h-9.5 sm:w-11.5 sm:h-11.5 flex items-center justify-center hover:bg-primary/5 border border-primary/10 rounded-full transition-colors duration-200 cursor-pointer text-primary"
    >
      {isDark ? (
        <Sun className="w-4.5 h-4.5 text-amber-400" />
      ) : (
        <Moon className="w-4.5 h-4.5 text-primary" />
      )}
    </button>
  );
}
