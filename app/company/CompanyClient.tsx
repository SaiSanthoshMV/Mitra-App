// app/company/CompanyClient.tsx

'use client';

import React, { useState } from 'react';
import { FileText, Package, Briefcase, ExternalLink, Loader2 } from 'lucide-react';
import PDFViewer from '@/components/PDFViewer';
import { usePDFViewer } from '@/hooks/usePDFViewer';

type Resource = {
  id: string;
  title: string;
  url: string;
  category: 'service' | 'product' | 'other';
  description?: string;
};

function safeOpenExternal(url: string) {
  if (!url) return;
  try {
    if (/^(https?:\/\/)/i.test(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // if not safe, open as-is (rare)
      window.open(url, '_blank');
    }
  } catch (e) {
    console.error('Failed to open external url', e);
  }
}

function CompanyCard({ resource, onOpen, isService }: { resource: Resource; onOpen: (url: string) => void; isService: boolean; }) {
  const handleClick = () => {
    if (isService) safeOpenExternal(resource.url);
    else onOpen(resource.url);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKey}
      className="group relative bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-xl dark:hover:shadow-2xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10 transition-all duration-300 cursor-pointer hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      aria-label={`${resource.title} - ${isService ? 'service' : 'product'}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent dark:from-cyan-400/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" aria-hidden />

      <div className="relative flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2">
            {resource.title}
            {isService && <ExternalLink className="w-4 h-4 opacity-70" aria-hidden />}
          </h3>
          {resource.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{resource.description}</p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl" aria-hidden />
    </div>
  );
}

export default function CompanyClient({
  serviceResources = [],
  productResources = [],
}: {
  serviceResources?: Resource[];
  productResources?: Resource[];
}) {
  const [loading] = useState(false); // server passed the data; keep false unless client fetch added
  const { pdfUrl, openPDF, closePDF } = usePDFViewer();

  const openPdfViewer = (url: string) => {
    if (!url) return;
    openPDF(url);
  };

  return (
    <>
      <div>
        {/* Service Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center animate-none">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Service Based</h2>
          </div>

          <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : serviceResources.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400">No service resources available</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {serviceResources.map((r) => (
                  <CompanyCard key={r.id} resource={r} onOpen={openPdfViewer} isService={true} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product Based</h2>
          </div>

          <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : productResources.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400">No product resources available</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {productResources.map((r) => (
                  <CompanyCard key={r.id} resource={r} onOpen={openPdfViewer} isService={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <PDFViewer
        url={pdfUrl}
        onClose={closePDF}
      />
    </>
  );
}