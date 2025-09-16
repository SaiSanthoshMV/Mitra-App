// app/company/page.tsx

import React from 'react';
import { createServerSupabase } from '@/lib/supabaseServer';
import type { Metadata } from 'next';
import NSSWatermark from '@/components/NSSWatermark';

export const revalidate = 86400; // 24 hours ISR (adjust if you update resources frequently)

export const metadata: Metadata = {
  title: 'Company Resources • Mitra — NSS KMIT',
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

export default async function Page():  Promise<React.JSX.Element>  {
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
          <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="text-2xl font-semibold text-red-600">Unable to load company resources</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              There was an issue fetching resources. Please try again later.
            </p>
          </div>
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
          <h1 className="text-2xl font-semibold text-red-600">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try again in a few minutes.</p>
        </div>
      </main>
    );
  }
}