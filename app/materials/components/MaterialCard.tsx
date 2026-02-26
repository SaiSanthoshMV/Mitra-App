// app/materials/components/MaterialCard.tsx
'use client';

import React, { memo } from 'react';
import { FileText, Download, Eye, BookOpen, GraduationCap, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

interface MaterialCardProps {
    material: Material;
    onView: (url: string) => void;
}

// Truncate uploader email to username
function truncateEmail(email: string): string {
    if (!email) return 'Anonymous';
    const atIndex = email.indexOf('@');
    return atIndex > 0 ? email.substring(0, atIndex) : email;
}

const MaterialCard = memo(({ material, onView }: MaterialCardProps) => {
    const handleView = () => {
        if (material.file_url) {
            onView(material.file_url);
        }
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (material.file_url) {
            window.open(material.file_url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <Card
            className="group relative overflow-hidden hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10 transition-all duration-300 cursor-pointer hover:-translate-y-1 border-slate-200 dark:border-slate-700"
            onClick={handleView}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleView();
                }
            }}
            role="button"
            aria-label={`View ${material.title}`}
        >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent dark:from-cyan-400/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />

            <CardHeader className="relative z-10 pb-3">
                {/* Preview Area */}
                <div className="w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    {material.preview_url ? (
                        <div className="w-full h-full relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={material.preview_url}
                                alt={`Preview of ${material.title}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <FileText className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                    )}
                </div>

                <CardTitle className="text-lg line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {material.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="relative z-10 space-y-2 pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4 text-cyan-500" />
                    <span className="font-medium truncate">{material.subject}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="w-4 h-4 text-cyan-500" />
                    <Badge variant="outline" className="border-cyan-400/50 text-cyan-600 dark:text-cyan-400">
                        {material.semester}
                    </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs truncate">{truncateEmail(material.uploaded_by)}</span>
                </div>
            </CardContent>

            <CardFooter className="relative z-10 pt-3 flex gap-2">
                <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white"
                    onClick={handleView}
                    aria-label={`View ${material.title}`}
                >
                    <Eye className="w-4 h-4" />
                    View
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    aria-label={`Download ${material.title}`}
                >
                    <Download className="w-4 h-4" />
                </Button>
            </CardFooter>

            {/* Bottom accent bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" aria-hidden />
        </Card>
    );
});

MaterialCard.displayName = 'MaterialCard';

export default MaterialCard;
