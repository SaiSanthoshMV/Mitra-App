// app/materials/upload/loading.tsx

import { Loader2, Upload } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-xl mx-auto">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                            <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div className="h-10 bg-muted/50 rounded-lg w-80 animate-pulse" />
                    </div>
                    <div className="h-6 bg-muted/50 rounded-lg w-96 ml-15 animate-pulse" />
                    <div className="mt-3 ml-15">
                        <div className="h-6 bg-muted/50 rounded-full w-48 animate-pulse" />
                    </div>
                </div>

                {/* Form Card Skeleton */}
                <div className="bg-card border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-6">
                    <div className="space-y-6">
                        {/* Title */}
                        <div className="h-6 bg-muted/50 rounded w-40 mb-4 animate-pulse" />
                        <div className="h-4 bg-muted/50 rounded w-64 mb-6 animate-pulse" />

                        {/* Form Fields */}
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-muted/50 rounded w-32 animate-pulse" />
                                <div className="h-12 bg-muted/50 rounded-lg animate-pulse" />
                            </div>
                        ))}

                        {/* File Upload Area */}
                        <div className="space-y-2">
                            <div className="h-4 bg-muted/50 rounded w-28 animate-pulse" />
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-12">
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="w-12 h-12 bg-muted/50 rounded-full animate-pulse" />
                                    <div className="h-4 bg-muted/50 rounded w-48 animate-pulse" />
                                    <div className="h-3 bg-muted/50 rounded w-32 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <div className="h-14 bg-muted/50 rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Center Loading Indicator */}
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-card border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-xl pointer-events-auto">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mx-auto" />
                        <p className="text-sm text-muted-foreground mt-3">Loading upload form...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
