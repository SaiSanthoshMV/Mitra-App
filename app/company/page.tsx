// app/company/page.tsx

import React from 'react';
import { createServerSupabase } from '@/lib/supabaseServer';
import type { Metadata } from 'next';
import NSSWatermark from '@/components/NSSWatermark';

export const revalidate = 86400; // 24 hours ISR (adjust if you update resources frequently)

export const metadata: Metadata = {
  title: 'Company Resources • Mitra — RECURSE KMIT',
  description: 'Service- and product-based placement materials and company resources for KMIT students.',
};

type RawResource = {
  id: number | string;
  title?: string | null;
  url?: string | null;
  category?: string | null;
  description?: string | null;
};

type Resource = {
  id: string;
  title: string;
  url: string;
  category: 'service' | 'product' | 'other';
  description?: string;
};

// client component loaded dynamically (client-only)
import CompanyClient from './CompanyClient';
import { Building2 } from 'lucide-react';
import ReloadPage from '@/components/ReloadPage';

export default async function Page(): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();

  try {
    // fetch resources server-side; limit protects against huge responses
    const { data, error } = await supabase
      .from('links')
      .select('id,title,url,category,description')
      .order('title', { ascending: true })
      .limit(1000);

    if (error) {
      console.error('Supabase (company resources) error:', error);
      return (
        <main className="min-h-screen p-6 relative">
          <NSSWatermark variant="minimal" />
          <ReloadPage />
        </main>
      );
    }

    const rows: RawResource[] = Array.isArray(data) ? data : [];

    // normalize and categorize
    const normalized: Resource[] = rows.map((r) => {
      const cat = (r.category ?? '').toString().trim().toLowerCase();
      return {
        id: String(r.id ?? Math.random().toString(36).slice(2, 9)),
        title: (r.title ?? '').trim() || 'Untitled',
        url: (r.url ?? '').trim() || '',
        category: cat === 'service' ? 'service' : cat === 'product' ? 'product' : 'other',
        description: r.description ?? undefined,
      };
    });

    // split lists server-side
    const serviceResources = normalized.filter((r) => r.category === 'service');
    const productResources = normalized.filter((r) => r.category === 'product');

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-6 lg:p-8 relative">
        <NSSWatermark variant="default" />
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Page Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-xl">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                  Company-wise Placement Materials
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Access placement resources organized by company type
                </p>
              </div>
            </div>
          </div>

          {/* Hydrate the interactive client component (small initial payload server-side) */}
          <CompanyClient
            serviceResources={serviceResources}
            productResources={productResources}
          />

        </div>
      </main>
    );
  } catch (err) {
    console.error('Unexpected error in company page:', err);
    return (
      <main className="min-h-screen p-6 relative">
        <NSSWatermark variant="minimal" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-xl mb-6">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
              We encountered an issue loading the company resources. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reload Page
            </button>
          </div>
        </div>
      </main>
    );
  }
}