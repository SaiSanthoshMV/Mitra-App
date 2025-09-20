// app/placements/page.tsx

import React from 'react';
import { createServerSupabase } from '@/lib/supabaseServer';
import type { Metadata } from 'next';
import NSSWatermark from '@/components/NSSWatermark';

export const revalidate = 3600; // 1 hour ISR — adjust as needed

export const metadata: Metadata = {
  title: 'Placement Records • Mitra — NSS KMIT',
  description: 'Campus placement records — companies, offers, ctc and documents for KMIT students.',
};

type CompanyDocument = {
  id: number;
  title: string;
  url: string;
  company_id: number;
};

type Company = {
  id: number;
  sno: number;
  name: string;
  offers: string;
  month: string;
  stipend?: string | null;
  ctc: string;
  description: string;
  process: string;
  company_documents?: CompanyDocument[] | null;
};

// client component is interactive — import dynamically so server bundle stays lean
import PlacementClient from './PlacementClient';
import { Building2 } from 'lucide-react';
import NSSWatermarkSmall from '@/components/NSSWatermarkSmall';
import ReloadPage from '@/components/ReloadPage';
export default async function Page(): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();

  try {
    const { data, error } = await supabase
      .from('companies')
      .select(
        `id, sno, name, offers, month, stipend, ctc, description, process, company_documents(id, title, url, company_id)`
      )
      .order('sno', { ascending: true })
      .limit(1000);

    if (error) {
      console.error('Supabase error (placements):', error);
      return (
        <main className="min-h-screen p-6 relative">
          <NSSWatermark variant="minimal" />
          <ReloadPage />
        </main>
      );
    }

    // ensure serializable — convert Date objects to strings if needed
    const companies: Company[] = (Array.isArray(data) ? data : []).map((c): Company => ({
      id: c.id as number,
      sno: c.sno as number,
      name: (c.name ?? '') as string,
      offers: (c.offers ?? '') as string,
      month: (c.month ?? '') as string,
      stipend: (c.stipend ?? null) as string | null,
      ctc: (c.ctc ?? '') as string,
      description: (c.description ?? '') as string,
      process: (c.process ?? '') as string,
      company_documents: Array.isArray(c.company_documents)
        ? c.company_documents.map((d): CompanyDocument => ({
          id: d.id as number,
          title: (d.title ?? '') as string,
          url: (d.url ?? '') as string,
          company_id: d.company_id as number,
        }))
        : [],
    }));

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-6 relative">
        <NSSWatermarkSmall variant="default" />
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
        </div>
      </main>
    );
  } catch (err) {
    console.error('Unexpected error in placements page:', err);
    return (
      <main className="min-h-screen p-6 relative">
        <NSSWatermark variant="minimal" />
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-2xl font-semibold text-red-600">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try again in a few minutes.</p>
        </div>
      </main>
    );
  }
}