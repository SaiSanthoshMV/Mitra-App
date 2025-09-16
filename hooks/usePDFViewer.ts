// hooks/usePDFViewer.ts
"use client";

import { useState, useCallback } from 'react';

interface UsePDFViewerReturn {
  /** Current PDF URL being displayed */
  pdfUrl: string | null;
  /** Whether the PDF viewer is open */
  isOpen: boolean;
  /** Open the PDF viewer with a specific URL */
  openPDF: (url: string) => void;
  /** Close the PDF viewer */
  closePDF: () => void;
}

/**
 * Custom hook for managing PDF viewer state
 * Provides consistent state management across different components
 */
export function usePDFViewer(): UsePDFViewerReturn {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const openPDF = useCallback((url: string) => {
    if (!url) return;
    setPdfUrl(url);
  }, []);

  const closePDF = useCallback(() => {
    setPdfUrl(null);
  }, []);

  return {
    pdfUrl,
    isOpen: Boolean(pdfUrl),
    openPDF,
    closePDF
  };
}