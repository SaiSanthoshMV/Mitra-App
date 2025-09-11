'use client';

import { Button } from '@/components/ui/button';
import { Link2Icon, ChevronDownIcon, KeyIcon, CopyIcon } from 'lucide-react';
import GradientText from '@/components/blocks/TextAnimations/GradientText/GradientText';
import { useState } from 'react';

type Link = {
  id: number;
  title: string;
  url: string;
  category?: string | null;
  created_at?: string | null;
  description?: string | null;
};

type PasswordInfo = {
  id: number;
  title: string;
  description: string;
};

interface LinksPageProps {
  links: Link[];
  passwordInfo: PasswordInfo[];
}

export default function LinksPageClient({ links, passwordInfo }: LinksPageProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 tracking-tight font-['Playfair_Display','serif'] italic">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa", "#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={2}
            showBorder={false}
          >
            College Portals & Links <span role="img" aria-label="link">🔗</span>
          </GradientText>
        </h1>
        
        <div className="space-y-4">
          {/* Regular Links */}
          {links.map((link) => (
            <Button
              key={link.id}
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
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center relative w-full h-full"
              >
                <span className="text-lg font-normal tracking-normal group-hover:text-cyan-400 transition-colors font-serif">
                  {link.title}
                </span>

                <Link2Icon
                  className="absolute right-5 w-5 h-5 text-current opacity-60 group-hover:opacity-90 transition-opacity"
                />

                {link.description && (
                  <span
                    className="
                      absolute left-1/2 -translate-x-1/2 bottom-full mb-3
                      px-4 py-2 rounded-xl text-sm font-medium
                      bg-gradient-to-r from-cyan-500 to-blue-600 
                      text-white shadow-lg ring-1 ring-black/20
                      opacity-0 group-hover:opacity-100 
                      scale-95 group-hover:scale-100
                      transition-all duration-200 ease-out
                      pointer-events-none whitespace-nowrap z-10
                      font-serif
                    "
                  >
                    {link.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 
                                    w-0 h-0 border-x-8 border-x-transparent 
                                    border-t-8 border-t-cyan-500/90"></div>
                  </span>
                )}
              </a>
            </Button>
          ))}

          {/* Passwords Dropdown Button */}
          {/* Passwords Inline Expand (replaces the previous absolute dropdown) */}
          <div>
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="
                group relative w-full h-16 justify-center 
                rounded-3xl shadow-lg border border-transparent
                transition-all duration-300 ease-in-out
                hover:scale-[1.02] hover:shadow-xl
                hover:border-cyan-400/60 hover:bg-cyan-50
                dark:hover:bg-slate-800
              "
              aria-expanded={isDropdownOpen}
              aria-controls="passwords-list"
              id="passwords-toggle"
            >
              <span className="text-lg font-normal tracking-normal font-serif group-hover:text-cyan-400 transition-colors">
                Passwords
              </span>
              {1 && (
                <span
                  className="
                    absolute left-1/2 -translate-x-1/2 bottom-full mb-3
                    px-4 py-2 rounded-xl text-sm font-medium
                    bg-gradient-to-r from-cyan-500 to-blue-600 
                    text-white shadow-lg ring-1 ring-black/20
                    opacity-0 group-hover:opacity-100 
                    scale-95 group-hover:scale-100
                    transition-all duration-200 ease-out
                    pointer-events-none whitespace-nowrap z-10
                    font-serif
                  "
                >
                  {"Passwords of Wifis and Portals"}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 
                                  w-0 h-0 border-x-8 border-x-transparent 
                                  border-t-8 border-t-cyan-500/90"></div>
                </span>
              )}

              <KeyIcon className="absolute left-5 w-5 h-5 text-current opacity-80" />

              <ChevronDownIcon
                className={`absolute right-5 w-5 h-5 text-current opacity-80 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>

            {/* Inline expanded block (pushes content down instead of overlaying) */}
            {isDropdownOpen && (
              <div
                id="passwords-list"
                role="region"
                aria-labelledby="passwords-toggle"
                className="mt-3 relative z-20"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                  {/* make the list scrollable when long */}
                  <div className="relative">
                    <div
                      className="max-h-[60vh] overflow-y-auto focus:outline-none"
                      role="menu"
                      aria-label="Passwords list"
                    >
                      {passwordInfo.length === 0 ? (
                        <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400 font-serif">
                          No passwords available
                        </div>
                      ) : (
                        passwordInfo.map((info) => (
                          <div
                            key={info.id}
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
                              <div className="text-sm text-gray-600 dark:text-gray-300 font-mono bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded mt-1">
                                {info.description}
                              </div>
                            </div>
                            <button
                              onClick={() => copyToClipboard(info.description, info.id)}
                              className="
                                ml-3 p-2 rounded-lg
                                hover:bg-gray-200 dark:hover:bg-slate-600
                                transition-colors duration-200
                                group
                              "
                              title="Copy password"
                            >
                              <CopyIcon
                                className={`w-4 h-4 transition-colors duration-200 ${
                                  copiedId === info.id
                                    ? 'text-green-500'
                                    : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                }`}
                              />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* fade masks to make scroll edges look nicer */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white dark:from-slate-900 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* End Passwords Dropdown Button */}
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}