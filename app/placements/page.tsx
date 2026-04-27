// app/placements/page.tsx

import React from 'react';
import type { Metadata } from 'next';
import NSSWatermark from '@/components/NSSWatermark';
import { getPlacementsPageData } from './server-data';

export const revalidate = 3600; // 1 hour ISR — adjust as needed

export const metadata: Metadata = {
  title: 'Placement Records • Mitra — RECURSE KMIT',
  description: 'Campus placement records — companies, offers, ctc and documents for KMIT students.',
};

// client component is interactive — import dynamically so server bundle stays lean
import PlacementClient from './PlacementClient';
import { Building2, TriangleAlert } from 'lucide-react';
import NSSWatermarkSmall from '@/components/NSSWatermarkSmall';
import ReloadPage from '@/components/ReloadPage';
import LogoLoopPage from '@/components/LogoLoopPage';

export default async function Page(): Promise<React.JSX.Element> {
  try {
    const { companies, companyLogos, companiesError, logosError } = await getPlacementsPageData();

    if (companiesError) {
      console.error('Supabase error (placements):', companiesError);
      return (
        <main className="min-h-screen p-6 relative">
          {/* <NSSWatermark variant="minimal" /> */}
          <ReloadPage />
        </main>
      );
    }

    if (logosError) {
      console.error('Supabase error (company logos):', logosError);
    }

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-6 relative">
        {/* <NSSWatermarkSmall variant="default" /> */}
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 dark:from-cyan-400 dark:to-cyan-500 rounded-lg flex items-center justify-center">
              {/* inline icon — lightweight */}
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Placement Details</h1>
          </div>

          {/* Render the client component with initial data */}
          {/* It will hydrate on the client and provide the interactive behaviors */}
          <PlacementClient initialCompanies={companies} />

          <LogoLoopPage logos={companyLogos} />

          <div className="mt-8 flex items-start gap-3 p-4 rounded-xl border border-amber-300/40 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/30">
            <TriangleAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
              These Placement Records may not be accurate and are only intended to make students aware of different company recruitments.
            </p>
          </div>
        </div>
      </main>
    );
  } catch (err) {
    console.error('Unexpected error in placements page:', err);
    return (
      <main className="min-h-screen p-6 relative">
        {/* <NSSWatermark variant="minimal" /> */}
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-2xl font-semibold text-red-600">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try again in a few minutes.</p>
        </div>
      </main>
    );
  }
}