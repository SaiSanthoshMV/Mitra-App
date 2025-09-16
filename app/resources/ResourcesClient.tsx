// app/resources/ResourcesClient.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, Eye, Link2 } from 'lucide-react';
import Animation from '@/components/Animation';
import PDFViewer from '@/components/PDFViewer';
import { usePDFViewer } from '@/hooks/usePDFViewer';

type DocumentItem = {
  id: string | number;
  title: string;
  pdf_url: string;
  category?: number | string | null;
  subject_id?: number | string | null;
};

type Subject = {
  id: string | number;
  name: string;
  documents?: DocumentItem[];
};

function isExternalCategory(cat?: number | string | null): boolean {
  // treat '1' or 1 as external (your original logic)
  if (cat == null) return false;
  return Number(cat) === 1;
}

// Document row — keyboard accessible; Enter/Space opens
function DocumentRow({ doc, onView }: { doc: DocumentItem; onView: (url: string) => void }) {
  const external = isExternalCategory(doc.category);
  const handleOpen = () => {
    if (external) {
      if (doc.pdf_url) window.open(doc.pdf_url, '_blank', 'noopener,noreferrer');
    } else {
      if (doc.pdf_url) onView(doc.pdf_url);
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
      onClick={handleOpen}
      className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 cursor-pointer rounded-md transition-colors group focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      aria-label={`Open ${doc.title}`}
    >
      <span className="text-sm font-medium">{doc.title}</span>
      {external ? (
        <Link2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden />
      ) : (
        <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden />
      )}
    </div>
  );
}

// Subject collapsible section
function SubjectSection({ subject, onView }: { subject: Subject; onView: (url: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border rounded-lg bg-card shadow-sm mb-3 overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setExpanded((s) => !s)}
        className="w-full flex justify-between items-center px-4 py-3 font-semibold hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        aria-expanded={expanded}
        aria-controls={`subject-${subject.id}`}
      >
        <div className="flex items-center gap-2">
          <span>{subject.name}</span>
          <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full border">
            {(subject.documents ?? []).length} Docs
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {expanded && (
        <div id={`subject-${subject.id}`} className="divide-y">
          {(subject.documents ?? []).map((doc) => (
            <DocumentRow key={doc.id} doc={doc} onView={onView} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ResourcesClient({ initialSubjects = [] }: { initialSubjects?: Subject[] }) {
  const [subjects] = useState<Subject[]>(initialSubjects ?? []);
  const [loading, setLoading] = useState<boolean>(() => initialSubjects == null || initialSubjects.length === 0);
  const { pdfUrl, openPDF, closePDF } = usePDFViewer();

  // If initialSubjects is empty, optionally show Animation (already handled in server page),
  // but keep a fallback to attempt a client-side fetch only if needed (not recommended).
  useEffect(() => {
    if (initialSubjects && initialSubjects.length > 0) {
      setLoading(false);
    } else {
      setLoading(false); // no client fetch by default; show empty state
    }
  }, [initialSubjects]);

  if (loading) return <Animation />;

  return (
    <>
      <div className="space-y-3">
        {subjects.length === 0 ? (
          <div className="rounded-lg p-6 bg-card border text-sm text-slate-600">No study materials available.</div>
        ) : (
          subjects.map((s) => <SubjectSection key={s.id} subject={s} onView={openPDF} />)
        )}
      </div>

      {/* PDF Viewer */}
      <PDFViewer
        url={pdfUrl}
        onClose={closePDF}
        maxWidth="max-w-4xl"
        height="h-[85%]"
      />
    </>
  );
}
