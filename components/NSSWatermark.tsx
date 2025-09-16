// components/NSSWatermark.tsx
"use client";

import { memo } from 'react';
import NSSWatermarkSmall from './NSSWatermarkSmall';
import Image from 'next/image';

interface NSSWatermarkProps {
  /** Variant determines the size and positioning style */
  variant?: 'default' | 'compact' | 'minimal';
  /** Custom opacity override (default: 50%) */
  opacity?: number;
  /** Whether to show decorative small logos */
  showDecorative?: boolean;
  /** Custom main logo size in pixels */
  mainSize?: number;
  /** Custom rotation angle for main logo */
  mainRotation?: number;
}

interface MainLogoConfig {
  size: string;
  opacity: string;
  rotation: string;
  position: string;
}

const MAIN_LOGO_CONFIGS = {
  default: {
    size: 'w-[500px] h-[500px]',
    opacity: 'opacity-50',
    rotation: 'rotate-12',
    position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  },
  compact: {
    size: 'w-[450px] h-[450px]',
    opacity: 'opacity-50',
    rotation: 'rotate-8',
    position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  },
  minimal: {
    size: 'w-[400px] h-[400px]',
    opacity: 'opacity-50',
    rotation: 'rotate-6',
    position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  }
} as const;

const MainLogoImage = memo(({ config, customOpacity }: { config: MainLogoConfig; customOpacity?: number }) => {
  const opacityClass = customOpacity ? `opacity-${customOpacity}` : config.opacity;
  
  return (
    <div className={`absolute ${config.position} ${config.size} ${opacityClass} ${config.rotation} transition-opacity duration-700`}>
      <Image
        src="/logo/nss-logo.svg"
        alt=""
        fill={true}
        className="w-full h-full object-contain filter saturate-0 dark:invert-0 dark:brightness-150"
        aria-hidden="true"
      />
    </div>
  );
});

MainLogoImage.displayName = 'MainLogoImage';

function NSSWatermark({
  variant = 'default',
  opacity,
  showDecorative = true,
  mainSize,
  mainRotation
}: NSSWatermarkProps) {
  const mainConfig = MAIN_LOGO_CONFIGS[variant];
  
  // Create custom main config if overrides are provided
  const customMainConfig = {
    ...mainConfig,
    ...(mainSize && { size: `w-[${mainSize}px] h-[${mainSize}px]` }),
    ...(mainRotation && { rotation: `rotate-${mainRotation}` })
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Main logo - large and centered */}
      <MainLogoImage config={customMainConfig} customOpacity={opacity} />
      
      {/* Small decorative logos */}
      {showDecorative && (
        <NSSWatermarkSmall variant={variant} opacity={opacity} />
      )}
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 via-transparent to-white/40 dark:from-slate-900/40 dark:via-transparent dark:to-slate-800/50"></div>
    </div>
  );
}

export default memo(NSSWatermark);