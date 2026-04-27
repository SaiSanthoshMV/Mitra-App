// app/about/contact.tsx
'use client';

import React from 'react';
import { Headphones } from 'lucide-react';
import { Dock, DockIcon } from '@/components/magicui/dock';

export type IconProps = React.SVGProps<SVGSVGElement> & { title?: string };

export function DockDemo() {
  return (
    <div className="relative">
      <Dock iconMagnification={60} iconDistance={100}>
        <DockIcon className="bg-black/10 dark:bg-white/10">
          <a href="https://www.linkedin.com/in/saisanthoshmv/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Icons.linkedIn className="size-full" />
          </a>
        </DockIcon>

        <DockIcon className="bg-black/10 dark:bg-white/10">
          <a href="mailto:mvs.sai999@gmail.com" aria-label="Email">
            <Icons.mail className="size-full" />
          </a>
        </DockIcon>

        <DockIcon className="bg-black/10 dark:bg-white/10">
          <a href="https://linktr.ee/saigadutunes" target="_blank" rel="noopener noreferrer" aria-label="Music">
            <Icons.music className="size-full" />
          </a>
        </DockIcon>

        <DockIcon className="bg-black/10 dark:bg-white/10">
          <a href="https://saisanthoshmv.vercel.app/" target="_blank" rel="noopener noreferrer" aria-label="Website">
            <Icons.globe className="size-full" />
          </a>
        </DockIcon>

        <DockIcon className="bg-black/10 dark:bg-white/10">
          <a href="https://github.com/saisanthoshmv" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Icons.gitHub className="size-full" />
          </a>
        </DockIcon>
      </Dock>
    </div>
  );
}

const Icons = {
  gitHub: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <title>GitHub</title>
      <path d="M12 .297C5.373.297 0 5.668 0 12.3c0 5.292 3.438 9.79 8.205 11.387.6.111.82-.261.82-.579 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.47-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.62-5.475 5.92.429.37.81 1.096.81 2.21 0 1.596-.015 2.882-.015 3.276 0 .318.21.69.825.573C20.565 22.086 24 17.584 24 12.3 24 5.668 18.627.297 12 .297z" />
    </svg>
  ),

  linkedIn: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <title>LinkedIn</title>
      <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM7.34 18.67H4.67V9.33h2.67v9.34zM6 8.26c-0.9 0-1.6-0.73-1.6-1.65 0-0.92 0.7-1.65 1.6-1.65s1.6 0.73 1.6 1.65c0 0.92-0.7 1.65-1.6 1.65zM20.34 18.67h-2.67v-4.6c0-1.09-0.02-2.49-1.52-2.49-1.52 0-1.75 1.19-1.75 2.42v4.67H10.7V9.33h2.56v1.27h0.03c0.36-0.68 1.24-1.4 2.55-1.4 2.73 0 3.24 1.8 3.24 4.14v5.33z" />
    </svg>
  ),

  music: (props: IconProps) => (
    <Headphones aria-hidden="true" {...props} />
  ),

  mail: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
      <title>Email</title>
      <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="1.6" />
      <path d="M3 6.5l9 6 9-6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  globe: (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
      <title>Website</title>
      <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
      <path d="M2 12h20" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 2c2.5 3 2.5 16 0 20" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6 5c2.5 2.5 6.5 2.5 10 0" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6 19c2.5-2.5 6.5-2.5 10 0" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
};

export default DockDemo;
