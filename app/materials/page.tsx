// app/materials/page.tsx

import { Suspense } from 'react';
import { createServerSupabase } from '@/lib/supabaseServer';
import MaterialsClient from './MaterialsClient';
import LoadingSkeleton from './loading';

export const revalidate = 60; // Revalidate every 60 seconds for ISR

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

export default async function MaterialsPage() {
    const materials = await getMaterials();

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <MaterialsClient initialMaterials={materials} />
        </Suspense>
    );
}
