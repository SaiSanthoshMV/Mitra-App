// // used for testing any page before changing
// import React from 'react'

// function AboutPage() {
//   return (
//     <div>About Page</div>
//   )
// }

// export default AboutPage


// app/links/page.tsx
import { Button } from '@/components/ui/button';
import { createServerSupabase } from '@/lib/supabaseServer';
import { Link2Icon } from 'lucide-react';
import GradientText from '@/components/blocks/TextAnimations/GradientText/GradientText';

type Link = {
  id: number;
  title: string;
  url: string;
  category?: string | null;
  created_at?: string | null;
  description?: string | null;
};

export default async function LinksPage() {
  const supabase = createServerSupabase();
  const { data: links, error } = await supabase
    .from('links')
    .select('id,title,url,category,created_at,description')
    .eq('category', 'clubs')
    .order('id', { ascending: true });

  if (error) {
    return <div className="text-red-500">Error loading links: {error.message}</div>;
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-md mx-auto">

      
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 tracking-tight font-['Playfair_Display','serif'] italic">
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa", "#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={2}
          showBorder={false}
          // className="custom-class"
        >
          Clubs <span role="img" aria-label="link">💡</span>
        </GradientText>
      </h1>
      
        <div className="space-y-4">
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
                {/* Title */}
                <span className="text-lg font-normal tracking-normal group-hover:text-cyan-400 transition-colors font-serif">
                  {link.title}
                </span>

                {/* Link icon */}
                <Link2Icon
                  className="absolute right-5 w-5 h-5 text-current opacity-60 group-hover:opacity-90 transition-opacity"
                />

                {/* Description Tooltip */}
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
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 
                                    w-0 h-0 border-x-8 border-x-transparent 
                                    border-t-8 border-t-cyan-500/90"></div>
                  </span>
                )}
              </a>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}