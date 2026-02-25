// app/materials/upload/UploadClient.tsx

'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, BookOpen, GraduationCap, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UploadClientProps {
    userEmail: string;
}

interface FormData {
    title: string;
    semester: string;
    subject: string;
    file: File | null;
}

interface ValidationErrors {
    title?: string;
    semester?: string;
    subject?: string;
    file?: string;
}

const SEMESTERS = [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
];

const ACCEPTED_FILE_TYPES = [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = //5 * 1024 * 1024; // 5 MB in bytes
    11 * 1024 * 1024; // 10
export default function UploadClient({ userEmail }: UploadClientProps) {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        semester: '',
        subject: '',
        file: null,
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        if (!formData.semester) {
            newErrors.semester = 'Semester is required';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.file) {
            newErrors.file = 'Please select a file to upload';
        } else if (!ACCEPTED_FILE_TYPES.includes(formData.file.type)) {
            newErrors.file = 'Only PDF, PPT, DOC, and DOCX files are allowed';
        } else if (formData.file.size > MAX_FILE_SIZE) {
            newErrors.file = 'File size must not exceed 10 MB';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, file }));

        // Clear file error when a new file is selected
        if (file) {
            setErrors(prev => ({ ...prev, file: undefined }));
        }
    };

    // Handle file selection from file object
    const handleFileSelect = (file: File) => {
        setFormData(prev => ({ ...prev, file }));
        if (file) {
            setErrors(prev => ({ ...prev, file: undefined }));
        }
    };

    // Remove selected file
    const removeFile = () => {
        setFormData(prev => ({ ...prev, file: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Drag and drop handlers
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            handleFileSelect(file);
        }
    };

    // Handle click on upload area
    const handleUploadAreaClick = () => {
        if (!isUploading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset status
        setUploadStatus('idle');
        setStatusMessage('');

        // Validate
        if (!validateForm()) {
            return;
        }

        setIsUploading(true);

        try {
            // Create FormData for API request
            const apiFormData = new FormData();
            apiFormData.append('file', formData.file!);
            apiFormData.append('title', formData.title.trim());
            apiFormData.append('subject', formData.subject.trim());
            apiFormData.append('semester', formData.semester);
            // No need to send uploaded_by - API will use verified college email from session

            // Upload via API route (which handles R2 upload + Supabase metadata)
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: apiFormData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to upload file');
            }

            // Success!
            setUploadStatus('success');
            setStatusMessage('Material uploaded successfully! It will be available to all students.');

            // Reset form
            setFormData({
                title: '',
                semester: '',
                subject: '',
                file: null,
            });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setErrors({});

            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                setUploadStatus('idle');
            }, 5000);

        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('error');
            setStatusMessage(
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred. Please try again.'
            );
        } finally {
            setIsUploading(false);
        }
    };

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Upload className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            Upload Study Material
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground ml-15">
                        Share academic resources with fellow KMIT students
                    </p>
                    <div className="mt-3 ml-15">
                        <Badge variant="outline" className="text-xs border-cyan-400/50 text-cyan-600 dark:text-cyan-400">
                            Logged in as: {userEmail}
                        </Badge>
                    </div>
                </div>

                {/* Status Messages */}
                {uploadStatus === 'success' && (
                    <div className="mb-6 bg-green-50 dark:bg-green-950/30 border border-green-500/50 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                {statusMessage}
                            </p>
                        </div>
                        <button
                            onClick={() => setUploadStatus('idle')}
                            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                            aria-label="Dismiss success message"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {uploadStatus === 'error' && (
                    <div className="mb-6 bg-red-50 dark:bg-red-950/30 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-900 dark:text-red-100">
                                {statusMessage}
                            </p>
                        </div>
                        <button
                            onClick={() => setUploadStatus('idle')}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                            aria-label="Dismiss error message"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Upload Form Card */}
                <Card className="border-slate-200 dark:border-slate-700 shadow-xl">
                    <CardHeader>
                        <CardTitle>Material Details</CardTitle>
                        <CardDescription>
                            Fill in the details below to upload your study material
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title Field */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="flex items-center gap-2 text-sm font-semibold mb-2 text-foreground"
                                >
                                    <FileText className="w-4 h-4 text-cyan-500" />
                                    Material Title <span className="text-destructive">*</span>
                                </label>
                                <div className="relative group">
                                    <input
                                        id="title"
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, title: e.target.value }));
                                            setErrors(prev => ({ ...prev, title: undefined }));
                                        }}
                                        placeholder="e.g., DBMS Unit-3 Notes"
                                        className={`w-full px-4 py-3 bg-background border-2 rounded-xl text-foreground font-medium placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md ${errors.title
                                            ? 'border-destructive focus:ring-destructive/20 focus:border-destructive'
                                            : 'border-slate-300 dark:border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500 dark:focus:ring-cyan-400/50 dark:focus:border-cyan-400 hover:border-cyan-400 dark:hover:border-cyan-500'
                                            }`}
                                        disabled={isUploading}
                                        aria-invalid={!!errors.title}
                                        aria-describedby={errors.title ? 'title-error' : undefined}
                                    />
                                    {!errors.title && (
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                                    )}
                                </div>
                                {errors.title && (
                                    <p id="title-error" className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Semester Field */}
                            <div>
                                <label
                                    htmlFor="semester"
                                    className="flex items-center gap-2 text-sm font-semibold mb-2 text-foreground"
                                >
                                    <GraduationCap className="w-4 h-4 text-cyan-500" />
                                    Semester <span className="text-destructive">*</span>
                                </label>
                                <div className="relative group">
                                    <select
                                        id="semester"
                                        value={formData.semester}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, semester: e.target.value }));
                                            setErrors(prev => ({ ...prev, semester: undefined }));
                                        }}
                                        className={`w-full px-4 py-3 pr-10 bg-background border-2 rounded-xl text-foreground font-medium focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md appearance-none ${errors.semester
                                            ? 'border-destructive focus:ring-destructive/20 focus:border-destructive'
                                            : 'border-slate-300 dark:border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500 dark:focus:ring-cyan-400/50 dark:focus:border-cyan-400 hover:border-cyan-400 dark:hover:border-cyan-500'
                                            }`}
                                        style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
                                        disabled={isUploading}
                                        aria-invalid={!!errors.semester}
                                        aria-describedby={errors.semester ? 'semester-error' : undefined}
                                    >
                                        <option value="" className="text-muted-foreground">Select Semester</option>
                                        {SEMESTERS.map((sem) => (
                                            <option key={sem} value={sem}>
                                                {sem}
                                            </option>
                                        ))}
                                    </select>
                                    {!errors.semester && (
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                                    )}
                                </div>
                                {errors.semester && (
                                    <p id="semester-error" className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {errors.semester}
                                    </p>
                                )}
                            </div>

                            {/* Subject Field */}
                            <div>
                                <label
                                    htmlFor="subject"
                                    className="flex items-center gap-2 text-sm font-semibold mb-2 text-foreground"
                                >
                                    <BookOpen className="w-4 h-4 text-cyan-500" />
                                    Subject <span className="text-destructive">*</span>
                                </label>
                                <div className="relative group">
                                    <input
                                        id="subject"
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, subject: e.target.value }));
                                            setErrors(prev => ({ ...prev, subject: undefined }));
                                        }}
                                        placeholder="e.g., Database Management Systems"
                                        className={`w-full px-4 py-3 bg-background border-2 rounded-xl text-foreground font-medium placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md ${errors.subject
                                            ? 'border-destructive focus:ring-destructive/20 focus:border-destructive'
                                            : 'border-slate-300 dark:border-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500 dark:focus:ring-cyan-400/50 dark:focus:border-cyan-400 hover:border-cyan-400 dark:hover:border-cyan-500'
                                            }`}
                                        disabled={isUploading}
                                        aria-invalid={!!errors.subject}
                                        aria-describedby={errors.subject ? 'subject-error' : undefined}
                                    />
                                    {!errors.subject && (
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                                    )}
                                </div>
                                {errors.subject && (
                                    <p id="subject-error" className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {errors.subject}
                                    </p>
                                )}
                            </div>

                            {/* File Upload Field */}
                            <div>
                                <label
                                    htmlFor="file"
                                    className="flex items-center gap-2 text-sm font-medium mb-2 text-foreground"
                                >
                                    <Upload className="w-4 h-4 text-cyan-500" />
                                    Upload File <span className="text-destructive">*</span>
                                </label>

                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer ${errors.file
                                        ? 'border-destructive bg-destructive/5'
                                        : isDragging
                                            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20'
                                            : 'border-slate-300 dark:border-slate-600 hover:border-cyan-400 dark:hover:border-cyan-500 bg-slate-50/50 dark:bg-slate-800/30'
                                        }`}
                                    onClick={handleUploadAreaClick}
                                    onDragEnter={handleDragEnter}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {formData.file ? (
                                        // Selected file display
                                        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {formData.file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatFileSize(formData.file.size)}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={removeFile}
                                                disabled={isUploading}
                                                className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                                                aria-label="Remove file"
                                            >
                                                <X className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    ) : (
                                        // Upload prompt
                                        <div className="text-center pointer-events-none">
                                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Upload className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                                                    Click to upload
                                                </span>
                                                <span className="text-sm text-muted-foreground"> or drag and drop</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                PDF, PPT, DOC, DOCX (Max 10 MB)
                                            </p>
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        id="file"
                                        type="file"
                                        accept=".pdf,.ppt,.pptx,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={isUploading}
                                        aria-invalid={!!errors.file}
                                        aria-describedby={errors.file ? 'file-error' : undefined}
                                    />
                                </div>

                                {errors.file && (
                                    <p id="file-error" className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {errors.file}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isUploading}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5" />
                                            Upload Material
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Help Text */}
                {/* <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Need help? Contact us at{' '}
                        <a
                            href="mailto:support@kmit.edu.in"
                            className="text-cyan-600 dark:text-cyan-400 hover:underline"
                        >
                            support@kmit.edu.in
                        </a>
                    </p>
                </div> */}
            </div>
        </div>
    );
}
