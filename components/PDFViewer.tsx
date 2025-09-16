// components/PDFViewer.tsx
"use client";

import { memo, useCallback, useEffect, useRef } from 'react';
import { X, Telescope } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFViewerProps {
  /** The URL of the PDF to display */
  url: string | null;
  /** Callback when the viewer should be closed */
  onClose: () => void;
  /** Optional custom title for the viewer header */
  title?: string;
  /** Optional custom aria-label for accessibility */
  ariaLabel?: string;
  /** Custom z-index for the modal (default: 50) */
  zIndex?: number;
  /** Custom maximum width (default: max-w-6xl) */
  maxWidth?: string;
  /** Custom height (default: h-[80vh] for placements, h-[85%] for others) */
  height?: string;
}

/**
 * Converts various URL formats to embeddable iframe URLs
 * Handles Google Drive URLs and standard HTTP(S) URLs
 */
function getEmbeddableUrl(url: string): string {
  if (!url) return url;
  try {
    // Google Drive: /d/<id>/ or open?id=<id>
    const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch?.[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }
    
    const idQuery = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idQuery?.[1]) {
      return `https://drive.google.com/file/d/${idQuery[1]}/preview`;
    }

    // If it's a normal http(s) URL, return as-is
    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    // Fallback: return as-is (browser may handle)
    return url;
  } catch {
    return url;
  }
}

const PDFViewer = memo(function PDFViewer({
  url,
  onClose,
  title = "Projector",
  ariaLabel = "Document viewer",
  zIndex = 50,
  maxWidth = "max-w-6xl",
  height = "h-[85%]"
}: PDFViewerProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  // Store the last focused element when opening
  useEffect(() => {
    if (url) {
      lastActiveRef.current = document.activeElement as HTMLElement | null;
      // Focus the modal container for screen readers
      setTimeout(() => modalRef.current?.focus(), 50);
    }
  }, [url]);

  // Handle keyboard and click events for closing
  useEffect(() => {
    if (!url) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    function onDocumentClick(e: MouseEvent) {
      const node = modalRef.current;
      if (node && !node.contains(e.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onDocumentClick);
    
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onDocumentClick);
    };
  }, [url, onClose]);

  // Handle close with focus restoration
  const handleClose = useCallback(() => {
    onClose();
    // Restore focus to the last active element
    setTimeout(() => {
      lastActiveRef.current?.focus?.();
    }, 50);
  }, [onClose]);

  // Don't render anything if no URL is provided
  if (!url) {
    return null;
  }

  const embeddableUrl = getEmbeddableUrl(url);

  return (
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4`}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full ${maxWidth} ${height} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden outline-none`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Telescope className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            aria-label="Close document viewer"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* PDF Content */}
        <div className="w-full h-[calc(100%-4rem)] bg-white dark:bg-slate-900">
          <iframe
            src={embeddableUrl}
            className="w-full h-full border-0"
            title="PDF Viewer"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
});

PDFViewer.displayName = 'PDFViewer';

export default PDFViewer;