// app/materials/page.tsx

import { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import MaterialsClient from './MaterialsClient';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
    if (!url || !anonKey) {
        console.error('Missing Supabase credentials');
        return [];
    }

    const supabase = createClient(url, anonKey);

    try {
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

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Skeleton */}
                <div className="mb-8 space-y-4">
                    <div className="h-12 bg-muted/50 rounded-lg w-2/3 animate-pulse" />
                    <div className="h-6 bg-muted/50 rounded-lg w-1/2 animate-pulse" />
                </div>

                {/* Filter Skeleton */}
                <div className="mb-8 flex gap-4">
                    <div className="h-12 bg-muted/50 rounded-lg w-48 animate-pulse" />
                    <div className="h-12 bg-muted/50 rounded-lg w-48 animate-pulse" />
                </div>

                {/* Cards Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-card border rounded-xl p-6 space-y-4 animate-pulse">
                            <div className="h-40 bg-muted/50 rounded-lg" />
                            <div className="h-6 bg-muted/50 rounded w-3/4" />
                            <div className="h-4 bg-muted/50 rounded w-1/2" />
                            <div className="h-10 bg-muted/50 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default async function MaterialsPage() {
    const materials = await getMaterials();

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <MaterialsClient initialMaterials={materials} />
        </Suspense>
    );
}
