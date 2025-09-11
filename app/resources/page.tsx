"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, Eye, X, Link2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Type definitions
// 1) Update Document interface
interface Document {
  id: string | number;
  title: string;
  pdf_url: string;
  category?: number | string | null; // <-- added
}

interface Subject {
  id: string | number;
  name: string;
  documents: Document[];
}

interface LinkItem {
  id: string | number;
  title: string;
  url: string;
  category?: string | null;
  created_at?: string | null;
  description?: string | null;
}

// PDF Viewer Component
const PDFViewer: React.FC<{ pdfUrl: string; onClose: () => void }> = ({
  pdfUrl,
  onClose,
}) => {
  const getEmbeddableUrl = (url: string): string => {
    if (url.includes("drive.google.com")) {
      const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
      // also handle "open?id=" style
      const idFromQuery = url.match(/id=([a-zA-Z0-9-_]+)/)?.[1];
      if (idFromQuery) return `https://drive.google.com/file/d/${idFromQuery}/preview`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border rounded-xl w-[90%] max-w-4xl h-[85%] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Projector</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted transition-colors"
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

// 2) Replace DocumentRow with this implementation
const DocumentRow: React.FC<{ doc: Document; onView: (pdfUrl: string) => void }> = ({
  doc,
  onView,
}) => {
  const isExternal = Number(doc.category) === 1; // works for "1" or 1

  const openDoc = () => {
    if (isExternal) {
      if (doc.pdf_url) window.open(doc.pdf_url, "_blank", "noopener,noreferrer");
      return;
    }
    onView(doc.pdf_url);
  };

  return (
    <div
      className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 cursor-pointer rounded-md transition-colors group"
      onClick={openDoc}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDoc();
        }
      }}
    >
      <span className="text-sm font-medium">{doc.title}</span>

      {/* Icon: Eye for viewer documents, Link2 for external sheets */}
      {isExternal ? (
        <Link2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      ) : (
        <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      )}
    </div>
  );
};


// Subject Component
const SubjectSection: React.FC<{
  subject: Subject;
  onView: (pdfUrl: string) => void;
}> = ({ subject, onView }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg bg-card shadow-sm mb-3 overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center px-4 py-3 font-semibold hover:bg-muted/30"
      >
        <div className="flex items-center gap-2">
          <span>{subject.name}</span>
          <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full border">
            {subject.documents.length} Docs
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isExpanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isExpanded && (
        <div className="divide-y">
          {subject.documents.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} onView={onView} />
          ))}
        </div>
      )}
    </div>
  );
};

// DSA Sheets Dropdown Component
const DsaSheetsSection: React.FC<{ sheets: LinkItem[] }> = ({ sheets }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg bg-card shadow-sm mb-3 overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center px-4 py-3 font-semibold hover:bg-muted/30"
      >
        <div className="flex items-center gap-2">
          <span>DSA Sheets</span>
          <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full border">
            {sheets.length} Sheets
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isExpanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isExpanded && (
        <div className="divide-y">
          {sheets.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              No sheets available.
            </div>
          ) : (
            sheets.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 rounded-md transition-colors group"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{link.title}</span>
                  {link.description && (
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {link.description}
                    </span>
                  )}
                </div>
                <Link2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Main Resources Page
const Page: React.FC = () => {
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sheets, setSheets] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectsDocsAndSheets = async () => {
      setLoading(true);

      // Fetch all subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from("subjects")
        .select("*")
        .order("id", { ascending: true });

      if (subjectsError) {
        console.error("Error fetching subjects:", subjectsError);
        setLoading(false);
        return;
      }

      // Fetch all documents
      const { data: documentsData, error: documentsError } = await supabase
        .from("documents")
        .select("*")
        .order("id", { ascending: true });

      if (documentsError) {
        console.error("Error fetching documents:", documentsError);
        setLoading(false);
        return;
      }

      // Map documents under their subjects
      const subjectsWithDocs = (subjectsData || []).map((subj: any) => ({
        ...subj,
        documents: (documentsData || []).filter(
          (doc: any) => doc.subject_id === subj.id
        ),
      }));

      setSubjects(subjectsWithDocs);

      // Fetch DSA sheet links (category = 'sheet')
      const { data: linksData, error: linksError } = await supabase
        .from("links")
        .select("id,title,url,category,created_at,description")
        .eq("category", "sheet")
        .order("id", { ascending: true });

      if (linksError) {
        console.error("Error fetching links:", linksError);
        setSheets([]);
      } else {
        setSheets(linksData || []);
      }

      setLoading(false);
    };

    fetchSubjectsDocsAndSheets();
  }, []);

  if (loading) {
    return <p className="text-center py-6">Loading resources...</p>;
  }

  return (
    <div className="bg-background py-6 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📚 Study Materials</h1>

      <div className="space-y-3">
        {subjects.map((subject) => (
          <SubjectSection
            key={subject.id}
            subject={subject}
            onView={(url) => setPdfViewerUrl(url)}
          />
        ))}

        {/* DSA Sheets dropdown added here */}
        <DsaSheetsSection sheets={sheets} />
      </div>

      {pdfViewerUrl && (
        <PDFViewer pdfUrl={pdfViewerUrl} onClose={() => setPdfViewerUrl(null)} />
      )}
    </div>
  );
};

export default Page;