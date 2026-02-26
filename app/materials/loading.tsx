// app/materials/loading.tsx

import { Loader2, BookOpen } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Skeleton */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="h-10 bg-muted/50 rounded-lg w-64 animate-pulse" />
                    </div>
                    <div className="h-6 bg-muted/50 rounded-lg w-96 ml-15 animate-pulse" />
                    <div className="flex gap-2 mt-3 ml-15">
                        <div className="h-6 bg-muted/50 rounded-full w-32 animate-pulse" />
                        <div className="h-6 bg-muted/50 rounded-full w-28 animate-pulse" />
                    </div>
                </div>

                {/* Filter Skeleton */}
                <div className="mb-8 bg-card border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                    <div className="h-6 bg-muted/50 rounded-lg w-24 mb-4 animate-pulse" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <div className="h-4 bg-muted/50 rounded w-20 mb-2 animate-pulse" />
                            <div className="h-12 bg-muted/50 rounded-lg animate-pulse" />
                        </div>
                        <div>
                            <div className="h-4 bg-muted/50 rounded w-20 mb-2 animate-pulse" />
                            <div className="h-12 bg-muted/50 rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Cards Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-card border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-4 animate-pulse">
                            <div className="h-40 bg-muted/50 rounded-lg" />
                            <div className="h-6 bg-muted/50 rounded w-3/4" />
                            <div className="space-y-2">
                                <div className="h-4 bg-muted/50 rounded w-1/2" />
                                <div className="h-4 bg-muted/50 rounded w-2/3" />
                                <div className="h-4 bg-muted/50 rounded w-1/3" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-10 bg-muted/50 rounded flex-1" />
                                <div className="h-10 bg-muted/50 rounded w-12" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Center Loading Indicator */}
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-card border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-xl pointer-events-auto">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto" />
                        <p className="text-sm text-muted-foreground mt-3">Loading materials...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
