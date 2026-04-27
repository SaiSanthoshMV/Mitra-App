// app/materials/MaterialsClient.tsx
'use client';

import confetti from 'canvas-confetti';
import React, { useMemo, useState, useCallback } from 'react';
import { FileText, BookOpen, Upload, Sparkles, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PDFViewer from '@/components/PDFViewer';
import LoginDialog from '@/components/LoginDialog';
import NSSWatermarkSmall from '@/components/NSSWatermarkSmall';
import { usePDFViewer } from '@/hooks/usePDFViewer';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MaterialCard from './components/MaterialCard';
import FilterSection from './components/FilterSection';

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

// Extract unique values for filters
function getUniqueValues(materials: Material[], key: keyof Material): string[] {
    const values = materials.map(m => String(m[key])).filter(Boolean);
    return Array.from(new Set(values)).sort();
}

interface MaterialsClientProps {
    initialMaterials?: Material[];
}

export default function MaterialsClient({ initialMaterials = [] }: MaterialsClientProps) {
    const [materials] = useState<Material[]>(initialMaterials);
    const [selectedSemester, setSelectedSemester] = useState<string>('all');
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [showGiftDialog, setShowGiftDialog] = useState(false);
    const { pdfUrl, openPDF, closePDF } = usePDFViewer();
    const router = useRouter();
    const { data: session } = useSession();

    // Memoize filter values
    const semesters = useMemo(() => getUniqueValues(materials, 'semester'), [materials]);
    const subjects = useMemo(() => getUniqueValues(materials, 'subject'), [materials]);

    // Memoize filtered materials
    const filteredMaterials = useMemo(() => {
        return materials.filter(material => {
            const semesterMatch = selectedSemester === 'all' || material.semester === selectedSemester;
            const subjectMatch = selectedSubject === 'all' || material.subject === selectedSubject;
            return semesterMatch && subjectMatch;
        });
    }, [materials, selectedSemester, selectedSubject]);

    // Memoized callbacks
    const handleUploadClick = useCallback(() => {
        if (session) {
            router.push('/materials/upload');
        } else {
            setShowLoginDialog(true);
        }
    }, [session, router]);

    const handleMagicLinkClick = useCallback(() => {
        setShowGiftDialog(true);
    }, []);

    const handleClearFilters = useCallback(() => {
        setSelectedSemester('all');
        setSelectedSubject('all');
    }, []);

    const handleGiftBoxClick = useCallback(async (url: string, event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        await confetti({
            particleCount: 150,
            spread: 100,
            origin: {
                x: x / window.innerWidth,
                y: y / window.innerHeight,
            },
            colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#FF6347'],
        });

        setTimeout(() => {
            window.open(url, '_blank', 'noopener,noreferrer');
            setShowGiftDialog(false);
        }, 100);
    }, []);

    return (
        <>
            <div className="relative min-h-screen bg-background overflow-hidden">
                {/* <NSSWatermarkSmall variant="default" />  */}

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                    Study Buddy
                                </h1>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleUploadClick}
                                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload Material
                                </Button>
                                <Button
                                    onClick={handleMagicLinkClick}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Magic Link
                                </Button>
                            </div>
                        </div>
                        <p className="text-lg text-muted-foreground ml-15">
                            Access notes, PDFs, and materials shared by KMIT students
                        </p>
                        <div className="flex items-center gap-2 mt-3 ml-15">
                            <Badge variant="secondary" className="text-xs">
                                {materials.length} Total Materials
                            </Badge>
                            <Badge variant="outline" className="text-xs border-cyan-400/50 text-cyan-600 dark:text-cyan-400">
                                {filteredMaterials.length} Showing
                            </Badge>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <FilterSection
                        semesters={semesters}
                        subjects={subjects}
                        selectedSemester={selectedSemester}
                        selectedSubject={selectedSubject}
                        onSemesterChange={setSelectedSemester}
                        onSubjectChange={setSelectedSubject}
                        onClearFilters={handleClearFilters}
                    />

                    {/* Materials Grid */}
                    {filteredMaterials.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredMaterials.map(material => (
                                <MaterialCard
                                    key={material.id}
                                    material={material}
                                    onView={openPDF}
                                />
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mb-6">
                                <FileText className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2 text-foreground">No materials found</h3>
                            <p className="text-muted-foreground text-center max-w-md">
                                No materials match the selected filters. Try adjusting your filter criteria or explore different subjects and semesters.
                            </p>
                            {(selectedSemester !== 'all' || selectedSubject !== 'all') && (
                                <Button
                                    variant="outline"
                                    className="mt-6 border-cyan-400/50 hover:bg-cyan-50 dark:hover:bg-cyan-950"
                                    onClick={handleClearFilters}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* PDF Viewer Modal */}
            {pdfUrl && <PDFViewer url={pdfUrl} onClose={closePDF} />}

            {/* Login Dialog */}
            <LoginDialog
                open={showLoginDialog}
                onOpenChange={setShowLoginDialog}
            />

            {/* Gift Box Dialog */}
            <Dialog open={showGiftDialog} onOpenChange={setShowGiftDialog}>
                <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-cyan-950/30 border-2 border-purple-300 dark:border-purple-700">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                            🎁 Choose Your Surprise! 🎁
                        </DialogTitle>
                        <DialogDescription className="text-center text-lg mt-2">
                            Pick a magical gift box and discover what&apos;s inside!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-8 p-6">
                        {/* First Gift Box - Vidyaa */}
                        <div
                            onClick={(e) => handleGiftBoxClick('http://vidyaa-beta.vercel.app/', e)}
                            className="group relative cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-rotate-2"
                        >
                            <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300">
                                {/* Ribbon */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-gradient-to-b from-yellow-300 to-yellow-400 dark:from-yellow-400 dark:to-yellow-500"></div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-8 bg-gradient-to-r from-yellow-300 to-yellow-400 dark:from-yellow-400 dark:to-yellow-500"></div>

                                {/* Bow */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-400 dark:from-yellow-400 dark:to-yellow-500 rounded-full transform -rotate-12"></div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-400 dark:from-yellow-400 dark:to-yellow-500 rounded-full transform rotate-12"></div>
                                </div>

                                {/* Gift Icon */}
                                <div className="relative z-10 flex flex-col items-center justify-center h-32 mt-4">
                                    <Sparkles className="w-16 h-16 text-white mb-3 animate-pulse" />
                                    <p className="text-white font-bold text-lg text-center">Vidyaa Platform</p>
                                    <p className="text-white/80 text-sm text-center mt-1">Educational Resources</p>
                                </div>

                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            </div>
                        </div>

                        {/* Second Gift Box - All in One IT */}
                        <div
                            onClick={(e) => handleGiftBoxClick('https://tinyurl.com/allinoneit', e)}
                            className="group relative cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-2"
                        >
                            <div className="relative bg-gradient-to-br from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 rounded-2xl p-8 shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300">
                                {/* Ribbon */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-gradient-to-b from-red-400 to-red-500 dark:from-red-500 dark:to-red-600"></div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-8 bg-gradient-to-r from-red-400 to-red-500 dark:from-red-500 dark:to-red-600"></div>

                                {/* Bow */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 dark:from-red-500 dark:to-red-600 rounded-full transform -rotate-12"></div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 dark:from-red-500 dark:to-red-600 rounded-full transform rotate-12"></div>
                                </div>

                                {/* Gift Icon */}
                                <div className="relative z-10 flex flex-col items-center justify-center h-32 mt-4">
                                    <ExternalLink className="w-16 h-16 text-white mb-3 animate-pulse" />
                                    <p className="text-white font-bold text-lg text-center">All in One IT</p>
                                    <p className="text-white/80 text-sm text-center mt-1">Materials Drive</p>
                                </div>

                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-muted-foreground pb-2">
                        ✨ Click on any gift box to reveal your surprise! ✨
                    </p>
                </DialogContent>
            </Dialog>
        </>
    );
}
