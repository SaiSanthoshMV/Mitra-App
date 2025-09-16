// app/about/AboutActions.tsx
'use client';

import React, { useState } from 'react';
import { ShineBorder } from '@/components/magicui/shine-border';
import DeveloperDialog from '@/components/DeveloperDialog';

const INSTAGRAM_URL = 'https://www.instagram.com/nss.kmit/';

export default function AboutActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3 max-w-xs">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 px-4 py-3 rounded-2xl font-medium shadow-md ring-1 ring-slate-900/5
                    bg-cyan-400 text-slate-900 hover:bg-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-200/40 transition"
        >
          <InstagramIcon className="w-5 h-5" />
          <span>NSS KMIT</span>
        </a>

        <div className="relative inline-block rounded-2xl overflow-hidden">
          {/* Shiny border layer */}
          <ShineBorder
            shineColor={['#22d3ee', '#67e8f9', '#06b6d4']}
            borderWidth={3}
            duration={12}
            className="rounded-2xl pointer-events-none"
          />

          {/* Actual button */}
          <button
            onClick={() => setOpen(true)}
            className="relative w-full h-full z-10 inline-flex items-center justify-center gap-3 px-5 py-3 rounded-2xl font-medium shadow-md 
                      ring-1 ring-slate-900/5 bg-transparent border border-slate-300/10
                      transition"
          >
            Contact Developer
          </button>
        </div>
      </div>

      {/* Developer dialog moved to its own reusable component */}
      <DeveloperDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* ------------------ ICONS ------------------ */

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Instagram">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}