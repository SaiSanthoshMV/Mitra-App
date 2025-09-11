// components/RootClient.tsx
"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Splash from "@/components/Splash";

export default function RootClient({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  useEffect(() => {
    // fallback to hide splash no matter what after ~2.2s
    const t = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Splash screen shown on first load */}
      {showSplash ? (
        <Splash mode="splash" onFinish={() => setShowSplash(false)} />
      ) : null}

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-50 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; MITRA NSS KMIT {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </ThemeProvider>
  );
}
