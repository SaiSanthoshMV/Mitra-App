'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, FileText, Building2, X } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type CompanyDocument = {
  id: number;
  title: string;
  url: string;
  company_id: number;
};

type Company = {
  id: number;
  sno: number;
  name: string;
  offers: string;
  month: string;
  stipend?: string | null; // <-- NEW: stipend field (optional)
  ctc: string;
  description: string;
  process: string;
  company_documents: CompanyDocument[];
};

// PDF Viewer Component
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

const PlacementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from("companies")
          .select(
            `
            id,
            sno,
            name,
            offers,
            month,
            stipend, 
            ctc,
            description,
            process,
            company_documents ( id, title, url, company_id )
          `
          )
          .order("sno", { ascending: true });

        if (error) {
          console.error("Error fetching:", error);
          return;
        }

        setCompanies(data as Company[]);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    console.log("Fetching companies...");
    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companies;
    
    const q = searchTerm.toLowerCase();
    return companies.filter(company => 
      company.name.toLowerCase().includes(q) ||
      company.month.toLowerCase().includes(q) ||
      company.ctc.toLowerCase().includes(q) ||
      (company.stipend ?? '').toString().toLowerCase().includes(q) // <-- include stipend in search
    );
  }, [searchTerm, companies]);

  const toggleExpanded = (companyId: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  };

  const openPdfViewer = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPdfUrl(url);
  };

  const closePdfViewer = () => {
    setSelectedPdfUrl(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 dark:border-cyan-400"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 dark:from-cyan-400 dark:to-cyan-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Placement Details</h1>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for companies, job roles, or CTC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-cyan-500 dark:focus:border-cyan-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800/80 dark:to-slate-700/80 px-6 py-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Campus Placement Records</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">S.NO</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">COMPANY NAME</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">OFFERS</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">MONTH</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">STIPEND</th> {/* <-- NEW header */}
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">CTC</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company) => {
                    const isExpanded = expandedRows.has(company.id);
                    return (
                      <React.Fragment key={company.id}>
                        <tr
                          className={`group border-b border-slate-200 dark:border-slate-800 cursor-pointer transition-colors duration-200 
                            ${isExpanded 
                              ? 'bg-slate-100 dark:bg-slate-800/20 hover:bg-slate-200 dark:hover:bg-slate-800/30' 
                              : 'bg-white dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                            }`}
                          onClick={() => toggleExpanded(company.id)}
                        >
                          <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                            <div className="transition-transform duration-200 transform group-hover:translate-x-2">
                              {company.sno}
                            </div>
                          </td>
                          <td className="px-6 py-5 font-semibold text-cyan-600 dark:text-cyan-400">
                            <div className="transition-transform duration-200 transform group-hover:translate-x-2">
                              {company.name}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="transition-transform duration-200 transform group-hover:translate-x-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                                {company.offers}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                            <div className="transition-transform duration-200 transform group-hover:translate-x-2">
                              {company.month}
                            </div>
                          </td>

                          {/* NEW: stipend cell placed between month and ctc */}
                          <td className="px-6 py-5">
                            <div className="transition-transform duration-200 transform group-hover:translate-x-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-800/30 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                {company.stipend && company.stipend.trim() !== '' ? company.stipend : '—'}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5 font-semibold text-amber-600 dark:text-amber-400">
                            <div className="transition-transform duration-200 transform group-hover:translate-x-2">
                              {company.ctc}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="transition-transform duration-200 transform group-hover:translate-x-2 flex items-center justify-end">
                              <ChevronDown
                                className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr>
                            <td colSpan={7} className="px-0 py-0">
                              <div className="bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-700">
                                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                  {/* Description */}
                                  <div className="lg:col-span-1">
                                    <div className="bg-white dark:bg-slate-800/40 rounded-xl p-5 border border-slate-200 dark:border-slate-700 border-l-4 border-l-cyan-500 dark:border-l-cyan-400">
                                      <h4 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-3 flex items-center gap-2">
                                        <Building2 className="w-5 h-5" />
                                        Description
                                      </h4>
                                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                        {company.description}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Selection Process */}
                                  <div className="lg:col-span-1">
                                    <div className="bg-white dark:bg-slate-800/40 rounded-xl p-5 border border-slate-200 dark:border-slate-700 border-l-4 border-l-cyan-500 dark:border-l-cyan-400">
                                      <h4 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-3">Selection Process</h4>
                                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                        {company.process}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Documents */}
                                  <div className="lg:col-span-1">
                                    <div className="bg-white dark:bg-slate-800/40 rounded-xl p-5 border border-slate-200 dark:border-slate-700 border-l-4 border-l-cyan-500 dark:border-l-cyan-400">
                                      <h4 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-3 flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Documents
                                      </h4>
                                      {company.company_documents && company.company_documents.length > 0 ? (
                                        <div className="space-y-2">
                                          {company.company_documents.map((doc) => (
                                            <div
                                              key={doc.id}
                                              onClick={(e) => openPdfViewer(doc.url, e)}
                                              className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-700/30 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                                            >
                                              <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-300" />
                                              <span className="text-slate-700 dark:text-slate-300 text-sm group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                                {doc.title}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-slate-500 dark:text-slate-500 text-sm italic">No documents available</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>

              {filteredCompanies.length === 0 && !loading && (
                <div className="text-center py-12 bg-white dark:bg-transparent">
                  <p className="text-slate-500 dark:text-slate-500 text-lg">No companies found matching your search criteria.</p>
                </div>
              )}

              {companies.length === 0 && !loading && (
                <div className="text-center py-12 bg-white dark:bg-transparent">
                  <p className="text-slate-500 dark:text-slate-500 text-lg">No placement records available.</p>
                </div>
              )}
            </div>
          </div>
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

export default PlacementPage;