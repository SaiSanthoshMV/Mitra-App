// app/links/LinksPageClient.tsx

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link2Icon, ChevronDownIcon, KeyIcon, CopyIcon } from 'lucide-react';
import GradientText from '@/components/blocks/TextAnimations/GradientText/GradientText';
import NSSWatermark from '@/components/NSSWatermark';

type Link = {
  id: number | string;
  title: string;
  url?: string | null;
  category?: string | null;
  created_at?: string | null;
  description?: string | null;
};

type PasswordInfo = {
  id: number | string;
  title: string;
  description: string;
};

interface LinksPageProps {
  links: Link[];
  passwordInfo: PasswordInfo[];
}

export default function LinksPageClient({ links = [], passwordInfo = [] }: LinksPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<number | string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  // close on Escape and click outside
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    function onDocClick(e: MouseEvent) {
      if (!isOpen) return;
      const el = containerRef.current;
      if (el && !el.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onDocClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onDocClick);
    };
  }, [isOpen]);

  // copy feedback helper
  const copyToClipboard = async (text: string, id: number | string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      // small UX: announce to screen readers (off-DOM live region)
      const sr = document.getElementById('sr-live-region');
      if (sr) sr.textContent = 'Copied to clipboard';
      setTimeout(() => {
        setCopiedId((cur) => (cur === id ? null : cur));
        if (sr) sr.textContent = '';
      }, 1800);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // optionally fallback to older UI for copying
    }
  };

  // small utility to ensure safe href
  const safeHref = (href?: string | null) => {
    if (!href || typeof href !== 'string') return '#';
    // basic safety: allow http(s) or mailto only
    if (/^(https?:\/\/|mailto:)/i.test(href)) return href;
    // if not a safe URL, return hash so click doesn't navigate away
    return '#';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
      {/* NSS Watermark Background */}
      {/* <NSSWatermark variant="default" /> */}

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 tracking-tight italic font-['Playfair_Display','serif']">
            <GradientText
              colors={[
                '#40ffaa',
                '#4079ff',
                '#40ffaa',
                '#4079ff',
                '#40ffaa',
                '#40ffaa',
                '#4079ff',
                '#40ffaa',
                '#4079ff',
                '#40ffaa',
              ]}
              animationSpeed={2}
              showBorder={false}
            >
              College Portals & Links <span role="img" aria-label="link">🔗</span>
            </GradientText>
          </h1>

          <div className="space-y-4">
            {links.length === 0 ? (
              <div className="rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/10 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-300">No links available right now.</p>
              </div>
            ) : (
              links.map((link) => {
                const id = String(link.id ?? link.title);
                const description = link.description?.trim();
                const href = safeHref(link.url);

                return (
                  <Button
                    key={id}
                    asChild
                    className="
                    group relative w-full h-16 justify-center 
                    rounded-3xl shadow-lg border border-transparent
                    transition-all duration-300 ease-in-out
                    hover:scale-[1.02] hover:shadow-xl
                    hover:border-cyan-400/60 hover:bg-cyan-50
                    dark:hover:bg-slate-800
                  "
                  >
                    <a
                      href={href}
                      target={href === '#' ? undefined : '_blank'}
                      rel={href === '#' ? undefined : 'noopener noreferrer'}
                      className="flex items-center justify-center relative w-full h-full focus:outline-none focus:ring-2 focus:ring-cyan-300/40 rounded-3xl"
                    >
                      <span className="text-lg font-normal tracking-normal group-hover:text-cyan-400 transition-colors font-serif">
                        {link.title}
                      </span>

                      <Link2Icon
                        className="absolute right-5 w-5 h-5 text-current opacity-60 group-hover:opacity-90 transition-opacity"
                        aria-hidden="true"
                      />

                      {description && (
                        <span
                          role="status"
                          aria-live="polite"
                          className="
                          absolute left-1/2 -translate-x-1/2 bottom-full mb-3
                          px-4 py-2 rounded-xl text-sm font-medium
                          bg-gradient-to-r from-cyan-500 to-blue-600
                          text-white shadow-lg ring-1 ring-black/20
                          opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                          scale-95 group-hover:scale-100 group-focus-within:scale-100
                          transition-all duration-200 ease-out
                          pointer-events-none whitespace-nowrap z-10
                          font-serif
                        "
                        >
                          {description}
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 
                                    w-0 h-0 border-x-8 border-x-transparent 
                                    border-t-8 border-t-cyan-500/90"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </a>
                  </Button>
                );
              })
            )}

            {/* Passwords Toggle */}
            <div ref={containerRef}>
              <Button
                ref={toggleRef as React.Ref<HTMLButtonElement>} // build error without this
                onClick={() => setIsOpen((s) => !s)}
                aria-expanded={isOpen}
                aria-controls="passwords-list"
                className="
                group relative w-full h-12 justify-center 
                rounded-3xl shadow-lg border border-transparent
                transition-all duration-300 ease-in-out
                hover:scale-[1.02] hover:shadow-xl
                hover:border-cyan-400/60 hover:bg-cyan-50
                dark:hover:bg-slate-800
              "
              >
                <span className="text-lg font-normal tracking-normal font-serif group-hover:text-cyan-400 transition-colors">
                  Passwords
                </span>

                <KeyIcon className="absolute left-5 w-5 h-5 text-current opacity-80" aria-hidden="true" />

                <ChevronDownIcon
                  className={`absolute right-5 w-5 h-5 text-current opacity-80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                    }`}
                  aria-hidden="true"
                />
              </Button>

              {isOpen && (
                <div
                  id="passwords-list"
                  role="region"
                  aria-labelledby="passwords-toggle"
                  className="mt-3 relative z-20"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="relative">
                      <div className="max-h-[60vh] overflow-y-auto focus:outline-none" role="menu" aria-label="Passwords list">
                        {passwordInfo.length === 0 ? (
                          <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400 font-serif">
                            No passwords available
                          </div>
                        ) : (
                          passwordInfo.map((info) => (
                            <div
                              key={String(info.id)}
                              className="
                              flex items-center justify-between px-4 py-3 
                              border-b border-gray-100 dark:border-slate-700 last:border-b-0
                              hover:bg-gray-50 dark:hover:bg-slate-800
                              transition-colors duration-200
                            "
                              role="menuitem"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 font-serif">
                                  {info.title}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 font-mono bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded mt-1 break-words">
                                  {info.description}
                                </div>
                              </div>

                              <button
                                onClick={() => copyToClipboard(info.description, String(info.id))}
                                className="ml-3 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
                                aria-label={`Copy ${info.title} password`}
                                title="Copy password"
                              >
                                <CopyIcon
                                  className={`w-4 h-4 transition-colors duration-200 ${copiedId === String(info.id)
                                    ? 'text-green-500'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                    }`}
                                />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* subtle fade masks */}
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white dark:from-slate-900 to-transparent" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SR live region for copy feedback */}
          <div id="sr-live-region" aria-live="polite" className="sr-only" />
        </div>
      </div>
    </div>
  );
}
