// app/about/page.tsx

import React from 'react';
import type { Metadata } from 'next';
import NSSWatermark from '@/components/NSSWatermark';

export const revalidate = 86400; // cache for 24 hours (change as needed)

export const metadata: Metadata = {
  title: 'About • Mitra — NSS KMIT',
  description:
    'Mitra — a student companion web app for Keshav Memorial Institute of Technology. Built by NSS KMIT.',
};

// Load client-only interactive area (buttons + modal + animations) as a client component.
// This keeps the server bundle tiny and delays client JS to when needed.
import AboutActions from './AboutActions';

export default function AboutPage(){
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
      {/* NSS Watermark Background */}
      <NSSWatermark variant="default" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-['Playfair_Display','serif'] mb-4">
            <span className="inline-block mr-3" role="img" aria-label="book">📖</span>
            About <span className="text-cyan-500">Mitra</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-['Inter'] leading-relaxed">
            Your all-in-one companion for a seamless college experience at KMIT
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Content - Centered */}
          <section>
            {/* Mission Section */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
              <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100 font-['Inter']">
                <span className="text-2xl mr-2">🎯</span>Our Mission
              </h2>
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
                <strong className="font-semibold text-cyan-600 dark:text-cyan-400">Mitra</strong> is a student companion web app designed exclusively for
                the students of <span className="font-semibold">Keshav Memorial Institute of Technology</span>. It
                centralizes college portals, placement materials, company insights and club information so that students can
                find what they need quickly.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cyan-600 dark:text-cyan-400 text-sm">�</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Quick access to official portals and resources</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">💼</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Curated placement resources and company guides</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 dark:text-green-400 text-sm">📊</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Up-to-date placement records and company details</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">🏛️</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Clubs in the college and their functionalities</span>
                </div>
              </div>
            </div>

            {/* Vision Section */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800/60 dark:to-slate-700/40 rounded-3xl p-8 shadow-lg border border-cyan-200/50 dark:border-slate-600 mb-8">
              <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100 font-['Inter']">
                <span className="text-2xl mr-2">💡</span>Vision & Values
              </h2>
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
                <strong className="text-cyan-600 dark:text-cyan-400">Mitra</strong> is an initiative by <span className="font-semibold">NSS KMIT</span>. It began with
                a simple mission: simplify student life by bringing all college-related resources under one roof. Built
                by students, for students — to save time, reduce friction, and make campus life more manageable.
              </p>
            </div>

            {/* Contact Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 font-['Inter']">
                <span className="text-xl mr-2">👋</span>Get in Touch
              </h3>
              <AboutActions />
            </div>
          </section>

          {/* Built With Section - Bottom */}
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-['Inter']">Built with</p>
            <div className="flex items-center justify-center gap-6">
              {/* Next.js */}
              <div className="relative group">
                <NextLogo className="w-6 h-6 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" />
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 text-xs px-2 py-1 rounded bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                  Next.js
                </div>
              </div>

              {/* Tailwind */}
              <div className="relative group">
                <TailwindLogo className="w-6 h-6 text-cyan-500 hover:text-cyan-600 transition-colors" />
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 text-xs px-2 py-1 rounded bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                  Tailwind CSS
                </div>
              </div>

              {/* Supabase */}
              <div className="relative group">
                <SupabaseLogo className="w-6 h-6 text-green-500 hover:text-green-600 transition-colors" />
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 text-xs px-2 py-1 rounded bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                  Supabase
                </div>
              </div>

              {/* Vercel */}
              <div className="relative group">
                <VercelLogo className="w-6 h-6 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" />
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 text-xs px-2 py-1 rounded bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                  Vercel
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ------------------ ICONS (kept inline for portability) ------------------ */

function NextLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
        <circle cx="90" cy="90" r="90" fill="white" />
      </mask>
      <g mask="url(#mask0)">
        <circle cx="90" cy="90" r="90" fill="black" />
        <path d="M149 157L82 55h-9v70h7V66l63 91h6V55h-7v102z" fill="white" />
      </g>
    </svg>
  );
}

function TailwindLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 154" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <path d="M128 0C93.867 0 74.667 17.067 70.4 51.2c8.533-11.733 18.133-16 28.8-12.8 6.267 2.133 10.667 7.467 15.467 13.333 8.267 10.133 17.067 20.8 37.333 20.8 23.467 0 38.4-18.133 41.6-41.6C181.333 17.067 162.133 0 128 0zM70.4 76.8C36.267 76.8 17.067 93.867 12.8 128c8.533-11.733 18.133-16 28.8-12.8 6.267 2.133 10.667 7.467 15.467 13.333 8.267 10.133 17.067 20.8 37.333 20.8 23.467 0 38.4-18.133 41.6-41.6-3.2-23.467-22.4-41.6-56.533-41.6z" fill="currentColor" />
    </svg>
  );
}

function SupabaseLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <path d="M163.1 253.3c-4.6 6.7-14.9 3.4-14.9-4.8V150H85.7c-7.7 0-12.2-8.7-7.9-15l67.2-97.3c4.6-6.7 14.9-3.4 14.9 4.8V106h62.4c7.7 0 12.2 8.7 7.9 15l-67.2 97.3z" fill="currentColor" />
    </svg>
  );
}

function VercelLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
    </svg>
  );
}