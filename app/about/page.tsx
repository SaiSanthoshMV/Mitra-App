"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "@/components/ProfileCard";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { Home, Settings, Search } from "lucide-react";
import { DockDemo } from "./contact";

// About page component for the Mitra app (Next.js + Tailwind + shadcn-friendly layout)
// - Responsive (mobile / laptop)
// - Supports light + dark mode using Tailwind utility classes
// - Main theme color: cyan-400
// - Two stacked buttons: Instagram (opens profile) and Contact Developer (shows a closeable card)
// - "Built With" shows logos (only icons)

const INSTAGRAM_URL = "https://www.instagram.com/nss.kmit/"; // replace with actual profile

export default function AboutMitra(): JSX.Element {
  const [openContact, setOpenContact] = useState(false);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left column - Title + BuiltWith */}
          <section className="lg:col-span-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-cyan-400 drop-shadow-[0_6px_20px_rgba(6,182,212,0.12)]">
              📖 About Mitra
            </h1>

            <p className="mt-6 text-lg sm:text-xl leading-relaxed max-w-3xl">
              <strong className="font-semibold">Mitra</strong> is a student companion web app designed exclusively for the
              students of <span className="font-semibold">Keshav Memorial Institute of Technology</span>. It centralizes
              college portals, placement materials, company insights and club information so that students can find what
              they need quickly.
            </p>

            <div className="mt-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200/20 shadow-md">
              <h2 className="text-2xl font-semibold">💡 Vision</h2>
              <p className="mt-3 text-slate-700 dark:text-slate-200/90">
                <strong>Mitra</strong> is an initiative by <span className="font-semibold">NSS KMIT</span>. It began with a simple
                mission: simplify student life by bringing all college-related resources under one roof. Built by students,
                for students — to save time, reduce friction, and make campus life more manageable.
              </p>

              <ul className="mt-4 grid sm:grid-cols-2 gap-3">
                <li className="text-sm leading-snug">• Quick access to official portals and resources</li>
                <li className="text-sm leading-snug">• Curated placement resources and company guides</li>
                <li className="text-sm leading-snug">• Up-to-date placement records and company details</li>
                <li className="text-sm leading-snug">• Club directory and ways to get involved</li>
              </ul>
            </div>

            {/* Buttons - stacked */}
            <div className="mt-8 flex flex-col gap-3 max-w-xs">
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

              <button
                onClick={() => setOpenContact(true)}
                aria-expanded={openContact}
                className="inline-flex items-center justify-center gap-3 px-4 py-3 rounded-2xl font-medium shadow-md ring-1 ring-slate-900/5
                  bg-transparent border border-slate-300/10 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              >
                Contact Developer
              </button>
            </div>

            {/* Built With (icons only) */}
            <div className="mt-10 flex items-center gap-5">
              <span className="text-sm font-medium mr-3 opacity-80">⚡ Built with</span>

              <div className="flex items-center gap-4">
                {/* Next.js */}
                <div className="relative group">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/10 shadow-sm">
                    <NextLogo className="w-7 h-7 text-cyan-400" />
                  </div>
                  <span className="absolute left-1/2 -translate-x-1/2 mt-2 text-xs px-2 py-1 rounded-md bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                    Next.js
                  </span>
                </div>

                {/* Tailwind CSS */}
                <div className="relative group">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/10 shadow-sm">
                    <TailwindLogo className="w-7 h-7 text-cyan-400" />
                  </div>
                  <span className="absolute left-1/2 -translate-x-1/2 mt-2 text-xs px-2 py-1 rounded-md bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                    Tailwind CSS
                  </span>
                </div>

                {/* Supabase */}
                <div className="relative group">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/10 shadow-sm">
                    <SupabaseLogo className="w-7 h-7 text-cyan-400" />
                  </div>
                  <span className="absolute left-1/2 -translate-x-1/2 mt-2 text-xs px-2 py-1 rounded-md bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                    Supabase
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* Right column - decorative card / quick summary */}
          <aside className="hidden lg:flex lg:flex-col gap-6 items-stretch">
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900/60 via-slate-800/40 to-transparent border border-slate-700/40 shadow-inner">
              <h3 className="text-lg font-semibold text-cyan-300">Quick Overview</h3>
              <dl className="mt-4 space-y-3 text-sm text-slate-300">
                <div>
                  <dt className="font-medium">Audience</dt>
                  <dd>KMIT students (all years)</dd>
                </div>
                <div>
                  <dt className="font-medium">Access</dt>
                  <dd>Open — no login required</dd>
                </div>
                <div>
                  <dt className="font-medium">Content</dt>
                  <dd>Links, resources, company & placement details, clubs</dd>
                </div>
              </dl>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/10">
              <h4 className="text-sm font-semibold text-slate-200">NSS KMIT</h4>
              <p className="mt-2 text-sm text-slate-300">Community initiative · Student driven · Non-profit</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Contact Modal / Card (overlay) */}
      <AnimatePresence>
        {openContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            aria-hidden={!openContact}
          >
            <motion.div
              initial={{ y: 10, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 8, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-800/40 shadow-2xl p-6"
              role="dialog"
              aria-modal="true"
            >
              <button
                onClick={() => setOpenContact(false)}
                aria-label="Close contact card"
                className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-full text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-cyan-400/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Developer</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-300">Reach out for feedback, suggestions or bugs.</p>
                </div>
              </div>
              <div className="mt-4 max-w-xs mx-auto scale-75">
                <ProfileCard
                  name="M Sai Santhosh"
                  title="NSS Coordinator"
                  handle="SaiSanthoshMV"
                  status="Online"
                  contactText="Contact Me"
                  iconUrl="https://your-website.com/path/to/code-icon.svg"
                  avatarUrl="./dev.png"
                  showUserInfo={true}
                  enableTilt={true}
                  enableMobileTilt={false}
                  onContactClick={() => {
                    window.open("https://www.linkedin.com/in/saisanthoshmv/", "_blank");
                  }}
                />
              </div>
              <div>
                <DockDemo/>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ------------------ ICONS ------------------ */

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NextLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="180"
        height="180"
      >
        <circle cx="90" cy="90" r="90" fill="white" />
      </mask>
      <g mask="url(#mask0)">
        <circle cx="90" cy="90" r="90" fill="black" />
        <path
          d="M149 157L82 55h-9v70h7V66l63 91h6V55h-7v102z"
          fill="white"
        />
      </g>
    </svg>
  );
}

export function TailwindLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 256 154"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M128 0C93.867 0 74.667 17.067 70.4 51.2c8.533-11.733 18.133-16 28.8-12.8 6.267 2.133 10.667 7.467 15.467 13.333 8.267 10.133 17.067 20.8 37.333 20.8 23.467 0 38.4-18.133 41.6-41.6C181.333 17.067 162.133 0 128 0zM70.4 76.8C36.267 76.8 17.067 93.867 12.8 128c8.533-11.733 18.133-16 28.8-12.8 6.267 2.133 10.667 7.467 15.467 13.333 8.267 10.133 17.067 20.8 37.333 20.8 23.467 0 38.4-18.133 41.6-41.6-3.2-23.467-22.4-41.6-56.533-41.6z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SupabaseLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M163.1 253.3c-4.6 6.7-14.9 3.4-14.9-4.8V150H85.7c-7.7 0-12.2-8.7-7.9-15l67.2-97.3c4.6-6.7 14.9-3.4 14.9 4.8V106h62.4c7.7 0 12.2 8.7 7.9 15l-67.2 97.3z"
        fill="currentColor"
      />
    </svg>
  );
}