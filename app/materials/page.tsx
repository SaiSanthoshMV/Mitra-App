// app/materials/page.tsx

import { Suspense } from 'react';
import { createServerSupabase } from '@/lib/supabaseServer';
import MaterialsClient from './MaterialsClient';
import LoadingSkeleton from './loading';
import { Metadata } from 'next';

export const revalidate = 60; // Revalidate every 60 seconds for ISR

export const metadata: Metadata = {
    title: 'Study Materials • Mitra — RECURSE KMIT',
    description:
        'Subject-wise notes and resources for Keshav Memorial Institute of Technology students.',
};


type Material = {
    id: string;
    title: string;
    subject: string;
    semester: string;
    file_url: string;
    uploaded_by: string;
    created_at?: string;
    preview_url?: string | null;
};

async function getMaterials(): Promise<Material[]> {
    try {
        const supabase = createServerSupabase();

        const { data, error } = await supabase
            .from('study_materials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching materials:', error);
            return [];
        }

        return data ?? [];
    } catch (error) {
        console.error('Error fetching materials:', error);
        return [];
    }
}

async function MaterialsContent() {
    const materials = await getMaterials();

    return <MaterialsClient initialMaterials={materials} />;
}

export default function MaterialsPage() {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <MaterialsContent />
        </Suspense>
    );
}
