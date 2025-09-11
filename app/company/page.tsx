'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Building2, Package, Briefcase, X, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type Resource = {
  id: number;
  title: string;
  url: string;
  category: string;
  description: string;
};

// PDF Viewer Component (reused from placements page)
const PDFViewer: React.FC<{ pdfUrl: string; onClose: () => void }> = ({
  pdfUrl,
  onClose,
}) => {
  const getEmbeddableUrl = (url: string): string => {
    if (url.includes("drive.google.com")) {
      const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Projector</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* PDF Content */}
        <div className="w-full h-[calc(100%-4rem)] bg-white dark:bg-slate-900">
          <iframe
            src={getEmbeddableUrl(pdfUrl)}
            className="w-full h-full border-0"
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
};

// Company Card Component
const CompanyCard: React.FC<{ 
  resource: Resource; 
  onOpen: (url: string) => void;
  isService: boolean;
}> = ({ resource, onOpen, isService }) => {
  const handleClick = () => {
    if (isService) {
      // Open service companies in new tab
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    } else {
      // Open product companies in PDF viewer
      onOpen(resource.url);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-xl dark:hover:shadow-2xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-400/10 transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent dark:from-cyan-400/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      
      <div className="relative flex items-center gap-4">
        {/* Icon Container */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-cyan-400/50 transition-all duration-300 group-hover:scale-110">
            <FileText className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2">
            {resource.title}
            {isService && (
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            )}
          </h3>
          {resource.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
              {resource.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Hover indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl" />
    </div>
  );
};

// Section Component
const ResourceSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  resources: Resource[];
  onOpenPdf: (url: string) => void;
  isService: boolean;
  loading: boolean;
}> = ({ title, icon, resources, onOpenPdf, isService, loading }) => {
  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center animate-pulse">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
          <p className="text-center text-slate-500 dark:text-slate-400">No resources available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>

      {/* Resources Container */}
      <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {resources.map((resource) => (
            <CompanyCard 
              key={resource.id} 
              resource={resource} 
              onOpen={onOpenPdf}
              isService={isService}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CompanyResourcesPage: React.FC = () => {
  const [serviceResources, setServiceResources] = useState<Resource[]>([]);
  const [productResources, setProductResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        
        // Fetch all resources
        const { data, error } = await supabase
          .from("links")
          .select("*")
          .order("title", { ascending: true });

        if (error) {
          console.error("Error fetching resources:", error);
          return;
        }

        if (data) {
          // Filter resources by category
          const service = data.filter(r => r.category?.toLowerCase() === 'service');
          const product = data.filter(r => r.category?.toLowerCase() === 'product');
          
          setServiceResources(service);
          setProductResources(product);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const openPdfViewer = (url: string) => {
    setSelectedPdfUrl(url);
  };

  const closePdfViewer = () => {
    setSelectedPdfUrl(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-xl">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                  Company-wise Placement Materials
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Access placement resources organized by company type
                </p>
              </div>
            </div>
          </div>

          {/* Service Based Section */}
          <ResourceSection
            title="Service Based"
            icon={<Briefcase className="w-6 h-6 text-white" />}
            resources={serviceResources}
            onOpenPdf={openPdfViewer}
            isService={true}
            loading={loading}
          />

          {/* Product Based Section */}
          <ResourceSection
            title="Product Based"
            icon={<Package className="w-6 h-6 text-white" />}
            resources={productResources}
            onOpenPdf={openPdfViewer}
            isService={false}
            loading={loading}
          />
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdfUrl && (
        <PDFViewer 
          pdfUrl={selectedPdfUrl} 
          onClose={closePdfViewer} 
        />
      )}
    </>
  );
};

export default CompanyResourcesPage;