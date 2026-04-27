// app/links/LinksPageServer.tsx

import React from 'react';
import { createServerSupabase } from '@/lib/supabaseServer';
import type { Metadata } from 'next';
import NSSWatermark from '@/components/NSSWatermark';

export const revalidate = 86400; // 24 hours ISR (adjust if you update links often)

export const metadata: Metadata = {
  title: 'College Links • Mitra — RECURSE KMIT',
  description: 'Quick access to college portals, wifi passwords and other resources for KMIT students.',
};

type Link = {
  id: number | string;
  title: string;
  url?: string | null;
  category?: string | null;
  created_at?: string | null;
  description?: string | null;
};

type PasswordInfo = {
  id: number | string;
  title: string;
  description: string;
};

// load client component dynamically to avoid shipping interactive code server-side
import LinksPageClient from './LinksPageClient';
import ReloadPage from '@/components/ReloadPage';
export default async function LinksPageServer(): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();

  try {
    const [{ data: linksData, error: linksError }, { data: passwordData, error: passwordError }] = await Promise.all([
      supabase
        .from('links')
        .select('id,title,url,category,created_at,description')
        .eq('category', 'college')
        .order('id', { ascending: true })
        .limit(500),
      supabase.from('info').select('id,title,description').order('id', { ascending: true }).limit(500),
    ]);

    if (linksError || passwordError) {
      console.error('Supabase fetch errors:', { linksError, passwordError });
      // show a friendly server-rendered error page fragment
      return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
          {/* NSS Watermark Background */}
          {/* <NSSWatermark variant="default" /> */}

          <ReloadPage />
        </main>
      );
    }

    const links: Link[] = Array.isArray(linksData) ? linksData : [];
    const passwordInfo: PasswordInfo[] = Array.isArray(passwordData) ? passwordData : [];

    // render the client component (hydrated on client), passing server-fetched data as props
    return <LinksPageClient links={links} passwordInfo={passwordInfo} />;
  } catch (err) {
    console.error('Unexpected error in LinksPageServer:', err);
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
        {/* NSS Watermark Background */}
        {/* <NSSWatermark variant="default" /> */}

        <div className="relative z-10 px-6 py-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-red-600">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try again in a few minutes.</p>
          </div>
        </div>
      </main>
    );
  }
}
