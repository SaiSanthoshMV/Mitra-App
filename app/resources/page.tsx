// app/resources/page.tsx

import React from 'react';
import { createServerSupabase } from '@/lib/supabaseServer';
import type { Metadata } from 'next';
import NSSWatermark from '@/components/NSSWatermark';
import { BookOpen } from 'lucide-react';
import ResourcesClient from './ResourcesClient';
import NSSWatermarkSmall from '@/components/NSSWatermarkSmall';
import ReloadPage from '@/components/ReloadPage';

export const revalidate = 86400; // 24 hours ISR

export const metadata: Metadata = {
  title: 'Study Materials • Mitra — NSS KMIT',
  description:
    'Subject-wise notes and resources for Keshav Memorial Institute of Technology students.',
};

type DocumentItem = {
  id: string | number;
  title: string;
  pdf_url: string;
  category?: number | string | null;
  subject_id?: number | string | null;
};

type Subject = {
  id: string | number;
  name: string;
  documents?: DocumentItem[];
};

export default async function Page(): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();

  try {
    const [{ data: subjectsData, error: subjectsError }, { data: documentsData, error: documentsError }] =
      await Promise.all([
        supabase.from('subjects').select('id,name').order('id', { ascending: true }).limit(500),
        supabase
          .from('documents')
          .select('id,title,pdf_url,category,subject_id')
          .order('id', { ascending: true })
          .limit(2000),
      ]);

    if (subjectsError || documentsError) {
      console.error('Supabase fetch error (resources):', { subjectsError, documentsError });
      return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
          <NSSWatermark variant="default" />
          <ReloadPage />
        </main>
      );
    }

    const documents: DocumentItem[] = Array.isArray(documentsData)
      ? documentsData.map(
        (d): DocumentItem => ({
          id: d.id as string | number,
          title: (d.title ?? 'Untitled') as string,
          pdf_url: (d.pdf_url ?? '') as string,
          category: (d.category ?? null) as number | string | null,
          subject_id: (d.subject_id ?? null) as number | string | null,
        })
      )
      : [];

    const subjects: Subject[] = Array.isArray(subjectsData)
      ? subjectsData.map(
        (s): Subject => ({
          id: s.id as string | number,
          name: (s.name ?? 'Untitled') as string,
          documents: documents.filter((d) => String(d.subject_id ?? '') === String(s.id ?? '')),
        })
      )
      : [];

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
        <NSSWatermarkSmall variant="default" />
        <div className="relative z-10 py-6 px-4 max-w-3xl mx-auto">
          <header className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 shadow-md">
              <BookOpen className="w-6 h-6 text-white" aria-hidden />
            </div>
            <h1 className="text-2xl font-semibold ">Placement Resources</h1>
          </header>
          <ResourcesClient initialSubjects={subjects} />
        </div>
      </main>
    );
  } catch (err) {
    console.error('Unexpected error in resources page:', err);
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
        <NSSWatermark variant="default" />
        <div className="relative z-10 py-6 px-4 max-w-3xl mx-auto">
          <header className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 shadow-md">
              <BookOpen className="w-6 h-6 text-white" aria-hidden />
            </div>
            <h1 className="text-2xl font-semibold text-white">Placement Resources</h1>
          </header>
          <div className="rounded-lg p-6 bg-card border text-sm text-red-600">
            An unexpected error occurred.
          </div>
        </div>
      </main>
    );
  }
}
