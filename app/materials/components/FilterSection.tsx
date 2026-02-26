// app/materials/components/FilterSection.tsx
'use client';

import React, { memo } from 'react';
import { Filter, BookOpen, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilterSectionProps {
    semesters: string[];
    subjects: string[];
    selectedSemester: string;
    selectedSubject: string;
    onSemesterChange: (semester: string) => void;
    onSubjectChange: (subject: string) => void;
    onClearFilters: () => void;
}

const FilterSection = memo(({
    semesters,
    subjects,
    selectedSemester,
    selectedSubject,
    onSemesterChange,
    onSubjectChange,
    onClearFilters
}: FilterSectionProps) => {
    const hasActiveFilters = selectedSemester !== 'all' || selectedSubject !== 'all';

    return (
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
                            onChange={(e) => onSemesterChange(e.target.value)}
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
                            onChange={(e) => onSubjectChange(e.target.value)}
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
            {hasActiveFilters && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {selectedSemester !== 'all' && (
                        <Badge
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive hover:text-white transition-colors"
                            onClick={() => onSemesterChange('all')}
                        >
                            {selectedSemester} ×
                        </Badge>
                    )}
                    {selectedSubject !== 'all' && (
                        <Badge
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive hover:text-white transition-colors"
                            onClick={() => onSubjectChange('all')}
                        >
                            {selectedSubject} ×
                        </Badge>
                    )}
                    <button
                        onClick={onClearFilters}
                        className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline ml-2"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
});

FilterSection.displayName = 'FilterSection';

export default FilterSection;
