// app/clubs/page.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { createServerSupabase } from '@/lib/supabaseServer';
import { Link2Icon } from 'lucide-react';
import GradientText from '@/components/blocks/TextAnimations/GradientText/GradientText';
import type { Metadata } from 'next';
import NSSWatermark from '@/components/NSSWatermark';
import ReloadPage from '@/components/ReloadPage';

export const revalidate = 86400; // ISR: 24 hours (adjust if content updates more/less frequently)

export const metadata: Metadata = {
  title: 'Clubs • Mitra — RECURSE KMIT',
  description: 'Find student clubs, their portals and resources at Keshav Memorial Institute of Technology.',
};

type ClubLink = {
  id: number | string;
  title: string;
  url: string;
  category?: string | null;
  created_at?: string | null;
  description?: string | null;
};

export default async function ClubsPage(): Promise<React.JSX.Element> {
  // server-side fetch via server Supabase client (service role or server key)
  const supabase = createServerSupabase();

  try {
    const { data: linksData, error } = await supabase
      .from('links')
      .select('id,title,url,category,created_at,description')
      .eq('category', 'clubs')
      .order('id', { ascending: true })
      .limit(200);

    if (error) {
      // Log server-side (add Sentry/logging here if configured)
      console.error('Supabase (clubs) error:', error);
      return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
          {/* NSS Watermark Background */}
          <NSSWatermark variant="default" />

          <ReloadPage />
        </main>
      );
    }

    const links: ClubLink[] = Array.isArray(linksData) ? linksData : [];

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
        {/* NSS Watermark Background */}
        <NSSWatermark variant="default" />

        <div className="relative z-10 px-6 py-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 tracking-tight italic font-['Playfair_Display','serif']">
              <GradientText
                colors={[
                  '#40ffaa',
                  '#4079ff',
                  '#40ffaa',
                  '#4079ff',
                  '#40ffaa',
                  '#40ffaa',
                  '#4079ff',
                  '#40ffaa',
                  '#4079ff',
                  '#40ffaa',
                ]}
                animationSpeed={2}
                showBorder={false}
              >
                Clubs <span role="img" aria-label="idea">💡</span>
              </GradientText>
            </h1>

            {/* Empty state */}
            {links.length === 0 ? (
              <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/10 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  No club links found yet. If you manage a club, add your link in the admin panel.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {links.map((link) => {
                  const id = String(link.id ?? `${link.title}-${Math.random()}`);
                  const description = link.description?.trim();
                  // Ensure URL is present; fallback to '#'
                  const href = link.url && typeof link.url === 'string' ? link.url : '#';

                  return (
                    <Button
                      key={id}
                      asChild
                      className="
                      group relative w-full h-16 justify-center 
                      rounded-3xl shadow-lg border border-transparent
                      transition-all duration-300 ease-in-out
                      hover:scale-[1.02] hover:shadow-xl
                      hover:border-cyan-400/60 hover:bg-cyan-50
                      dark:hover:bg-slate-800
                    "
                    >
                      <a
                        href={href}
                        target="_blank"
                        rel={href === '#' ? undefined : 'noopener noreferrer'}
                        className="flex items-center justify-center relative w-full h-full focus:outline-none focus:ring-2 focus:ring-cyan-300/40 rounded-3xl"
                      // allow tooltip to be visible on keyboard focus using group-focus-within
                      >
                        {/* Title */}
                        <span className="text-lg font-normal tracking-normal group-hover:text-cyan-400 transition-colors font-serif">
                          {link.title}
                        </span>

                        {/* Link icon */}
                        <Link2Icon
                          className="absolute right-5 w-5 h-5 text-current opacity-60 group-hover:opacity-90 transition-opacity"
                          aria-hidden="true"
                        />

                        {/* Description Tooltip (visible on hover and keyboard focus) */}
                        {description && (
                          <span
                            role="status"
                            aria-live="polite"
                            className="
                            absolute left-1/2 -translate-x-1/2 bottom-full mb-3
                            px-4 py-2 rounded-xl text-sm font-medium
                            bg-gradient-to-r from-cyan-500 to-blue-600
                            text-white shadow-lg ring-1 ring-black/20
                            opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                            scale-95 group-hover:scale-100 group-focus-within:scale-100
                            transition-all duration-200 ease-out
                            pointer-events-none whitespace-nowrap z-10
                            font-serif
                          "
                          >
                            {description}
                            {/* Tooltip arrow */}
                            <div
                              className="absolute top-full left-1/2 -translate-x-1/2 
                                    w-0 h-0 border-x-8 border-x-transparent 
                                    border-t-8 border-t-cyan-500/90"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </a>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  } catch (err) {
    // unexpected error
    console.error('Unexpected error fetching clubs:', err);
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
        {/* NSS Watermark Background */}
        <NSSWatermark variant="default" />

        <div className="relative z-10 px-6 py-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-red-600">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              We hit an unexpected error. Try again in a few minutes.
            </p>
          </div>
        </div>
      </main>
    );
  }
}
