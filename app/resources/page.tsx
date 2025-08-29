"use client"
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Eye, X } from "lucide-react";

// Type definitions
interface Unit {
  id: string;
  name: string;
  pdfUrl: string;
}

interface Category {
  id: string;
  name: string;
  unitsList: Unit[];
}

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-0 duration-200">
      <div className="bg-background border rounded-xl w-[90%] max-w-4xl h-[85%] flex flex-col shadow-xl animate-in zoom-in-95 fade-in-0 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-foreground">PDF Viewer</h3>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 hover:bg-muted rounded-md"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Iframe */}
        <div className="flex-1 p-6">
          <iframe
            src={getEmbeddableUrl(pdfUrl)}
            className="w-full h-full rounded-md border"
            title="PDF Viewer"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

// Unit Row Component
const UnitRow: React.FC<{ unit: Unit; onView: (pdfUrl: string) => void }> = ({
  unit,
  onView,
}) => (
  <div
    className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 cursor-pointer rounded-md transition-colors duration-200 group"
    onClick={() => onView(unit.pdfUrl)}
  >
    <span className="text-sm font-medium text-foreground">{unit.name}</span>
    <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
  </div>
);

// Category Component
const CategorySection: React.FC<{
  category: Category;
  onView: (pdfUrl: string) => void;
}> = ({ category, onView }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg bg-card shadow-sm mb-3 overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold bg-card hover:bg-muted/30 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-card-foreground">{category.name}</span>
          <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full border">
            {category.unitsList.length} Units
          </span>
        </div>
        <div className="transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </button>

      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ 
          maxHeight: isExpanded ? `${category.unitsList.length * 60}px` : '0px',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <div className="divide-y divide-border">
          {category.unitsList.map((unit, index) => (
            <div
              key={unit.id}
              className="animate-in slide-in-from-top-2 fade-in-0"
              style={{ 
                animationDelay: isExpanded ? `${index * 50}ms` : '0ms',
                animationDuration: '200ms'
              }}
            >
              <UnitRow unit={unit} onView={onView} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App
const App: React.FC = () => {
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);

  const handleViewPDF = (pdfUrl: string) => setPdfViewerUrl(pdfUrl);

  const categories: Category[] = [
    {
      id: "java",
      name: "Java Programming Materials",
      unitsList: [
        { id: "java1", name: "Handwritten Notes", pdfUrl: "https://drive.google.com/file/d/1BLpXzmAFI3Vk2lHztyF8NJGQCtqq0PmB/view?usp=drive_link" },
        { id: "java2", name: "Object-Oriented Programming", pdfUrl: "https://drive.google.com/file/d/1rdbpdgGhEF_TWO3GAJy0uQf0Exrn5R7F/view?usp=drive_link" },
        { id: "java3", name: "Full Notes", pdfUrl: "https://drive.google.com/file/d/1AId72u7vTkB95cvtBPiNFx0dlD4HE0GJ/view?usp=drive_link" },
        { id: "java4", name: "Syntax Sheet", pdfUrl: "https://drive.google.com/file/d/1SLyCpDDfFXPDbXwjWRYykthevVWDjSXm/view?usp=drive_link" },
      ],
    },
    {
      id: "html",
      name: "HTML",
      unitsList: [
        { id: "html1", name: "Notes", pdfUrl: "https://drive.google.com/file/d/10sS4Au22T0vuUrXdl3JAe_E_mwsh_vGj/view?usp=drive_link" },
        { id: "html2", name: "Short Notes", pdfUrl: "https://drive.google.com/file/d/1rMVBjxRf4pSkvrbBqjZl4rp0POoy1wCM/view?usp=drive_link" },
      ],
    },
    {
      id: "css",
      name: "CSS",
      unitsList: [
        { id: "css1", name: "Notes", pdfUrl: "https://drive.google.com/file/d/1dzBZGwGsToYcJji26pZofqGuKt9VOuCR/view?usp=drive_link" },
        { id: "css2", name: "Short Notes", pdfUrl: "https://drive.google.com/file/d/1KcltjW7f7mxyb9CRSpS1PQVsfsk__vju/view?usp=drive_link" },
      ],
    },
  ];

  return (
    <div className="bg-background py-6 px-4 max-w-3xl mx-auto">
      <div className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-bold mb-6 text-foreground">📚 Study Materials</h1>
      </div>
      
      <div className="space-y-3">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="animate-in fade-in-0 slide-in-from-bottom-4"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationDuration: '400ms'
            }}
          >
            <CategorySection category={category} onView={handleViewPDF} />
          </div>
        ))}
      </div>

      {pdfViewerUrl && (
        <PDFViewer pdfUrl={pdfViewerUrl} onClose={() => setPdfViewerUrl(null)} />
      )}
    </div>
  );
};

export default App;