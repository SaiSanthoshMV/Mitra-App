// components/RootClient.tsx
"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import Splash from "@/components/Splash";
import { InstagramIcon } from "lucide-react";
import DeveloperIconButton from "./DeveloperIconButton";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const INSTAGRAM_URL = "https://www.instagram.com/recurse.official/" as const;
const SPLASH_TIMEOUT = 1000 as const;

// Memoized Footer component to prevent unnecessary re-renders
const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 h-[0.7cm] border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-4 h-full">
        <Link
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4 inline-flex items-center justify-center p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-cyan-400 dark:hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 transition-colors duration-150"
          aria-label="NSS KMIT Instagram"
        >
          <InstagramIcon className="w-5 h-5" />
        </Link>
        <Link
          href="/about"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 rounded px-1"
        >
          &copy; MITRA RECURSE KMIT {currentYear}
        </Link>
        <DeveloperIconButton className="ml-4" />
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

function RootClient({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  const hideSplash = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(hideSplash, SPLASH_TIMEOUT);
    return () => clearTimeout(timeoutId);
  }, [hideSplash]);

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>

        {showSplash && <Splash mode="splash" onFinish={hideSplash} />}

        <main className="flex-1 overflow-y-auto pb-[0.7cm]">{children}</main>

        <Footer />
        <SpeedInsights />
        <Analytics />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default memo(RootClient);