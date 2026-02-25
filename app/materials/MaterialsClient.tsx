// app/materials/MaterialsClient.tsx

'use client';

import { Confetti, ConfettiButton } from '@/components/ui/confetti';
import confetti from 'canvas-confetti';

import React, { useMemo, useState, useEffect } from 'react';
import { FileText, Download, Eye, Filter, BookOpen, GraduationCap, User, ExternalLink, Upload, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PDFViewer from '@/components/PDFViewer';
import LoginDialog from '@/components/LoginDialog';
import { usePDFViewer } from '@/hooks/usePDFViewer';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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

// Truncate uploader email to username
function truncateEmail(email: string): string {
    if (!email) return 'Anonymous';
    const atIndex = email.indexOf('@');
    return atIndex > 0 ? email.substring(0, atIndex) : email;
}

// Material Card Component
function MaterialCard({ material, onView }: { material: Material; onView: (url: string) => void }) {
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
                        <img
                            src={material.preview_url}
                            alt={`Preview of ${material.title}`}
                            className="w-full h-full object-cover"
                        />
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
}

// Main Component
export default function MaterialsClient({ initialMaterials = [] }: { initialMaterials?: Material[] }) {
    const [materials] = useState<Material[]>(initialMaterials);
    const [selectedSemester, setSelectedSemester] = useState<string>('all');
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [showGiftDialog, setShowGiftDialog] = useState(false);
    const { pdfUrl, openPDF, closePDF } = usePDFViewer();
    const router = useRouter();
    const { data: session, status } = useSession();

    // Handle upload button click
    const handleUploadClick = () => {
        if (session) {
            // User is authenticated, navigate to upload page
            router.push('/materials/upload');
        } else {
            // User is not authenticated, show login dialog
            setShowLoginDialog(true);
        }
    };

    // Handle magic link button click
    const handleMagicLinkClick = () => {
        setShowGiftDialog(true);
    };

    // Handle gift box click with confetti and redirect
    const handleGiftBoxClick = async (url: string, event: React.MouseEvent<HTMLDivElement>) => {
        // Fire confetti from the gift box position
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

        // Wait a bit for confetti to show, then redirect
        setTimeout(() => {
            window.open(url, '_blank', 'noopener,noreferrer');
            setShowGiftDialog(false);
        }, 100);
    };

    // Handle successful login
    const handleLoginSuccess = () => {
        // Dialog will close and NextAuth will redirect
        setShowLoginDialog(false);
    };

    // Get unique filter values
    const semesters = useMemo(() => getUniqueValues(materials, 'semester'), [materials]);
    const subjects = useMemo(() => getUniqueValues(materials, 'subject'), [materials]);

    // Filter materials
    const filteredMaterials = useMemo(() => {
        return materials.filter(material => {
            const semesterMatch = selectedSemester === 'all' || material.semester === selectedSemester;
            const subjectMatch = selectedSubject === 'all' || material.subject === selectedSubject;
            return semesterMatch && subjectMatch;
        });
    }, [materials, selectedSemester, selectedSubject]);

    return (
        <>
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <div className="mb-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="w-5 h-5 text-cyan-500" />
                            <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Semester Filter */}
                            <div className="space-y-2">
                                <label htmlFor="semester-filter" className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <GraduationCap className="w-4 h-4 text-cyan-500" />
                                    Semester
                                </label>
                                <div className="relative">
                                    <select
                                        id="semester-filter"
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                        className="w-full px-4 py-2.5 pr-10 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400 hover:border-cyan-400 dark:hover:border-cyan-500 transition-all cursor-pointer appearance-none shadow-sm"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2306b6d4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 0.75rem center',
                                            backgroundSize: '1.25rem'
                                        }}
                                    >
                                        <option value="all">All Semesters</option>
                                        {semesters.map(sem => (
                                            <option key={sem} value={sem}>{sem}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Subject Filter */}
                            <div className="space-y-2">
                                <label htmlFor="subject-filter" className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <BookOpen className="w-4 h-4 text-cyan-500" />
                                    Subject
                                </label>
                                <div className="relative">
                                    <select
                                        id="subject-filter"
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                        className="w-full px-4 py-2.5 pr-10 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400 hover:border-cyan-400 dark:hover:border-cyan-500 transition-all cursor-pointer appearance-none shadow-sm"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2306b6d4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 0.75rem center',
                                            backgroundSize: '1.25rem'
                                        }}
                                    >
                                        <option value="all">All Subjects</option>
                                        {subjects.map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(selectedSemester !== 'all' || selectedSubject !== 'all') && (
                            <div className="mt-4 flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-muted-foreground">Active filters:</span>
                                {selectedSemester !== 'all' && (
                                    <Badge
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-destructive hover:text-white transition-colors"
                                        onClick={() => setSelectedSemester('all')}
                                    >
                                        {selectedSemester} ×
                                    </Badge>
                                )}
                                {selectedSubject !== 'all' && (
                                    <Badge
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-destructive hover:text-white transition-colors"
                                        onClick={() => setSelectedSubject('all')}
                                    >
                                        {selectedSubject} ×
                                    </Badge>
                                )}
                                <button
                                    onClick={() => {
                                        setSelectedSemester('all');
                                        setSelectedSubject('all');
                                    }}
                                    className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline ml-2"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>

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
                                    onClick={() => {
                                        setSelectedSemester('all');
                                        setSelectedSubject('all');
                                    }}
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
                onLoginSuccess={handleLoginSuccess}
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
