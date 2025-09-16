// components/NSSWatermarkSmall.tsx
"use client";

import Image from 'next/image';
import { memo } from 'react';

interface NSSWatermarkSmallProps {
  /** Variant determines the size and positioning style of small logos */
  variant?: 'default' | 'compact' | 'minimal';
  /** Custom opacity override (default: 50%) */
  opacity?: number;
}

interface LogoConfig {
  size: string;
  opacity: string;
  rotation: string;
  position: string;
}

const SMALL_VARIANT_CONFIGS = {
  default: [
    {
      size: 'w-32 h-32',
      opacity: 'opacity-50',
      rotation: '-rotate-12',
      position: 'top-20 right-20'
    },
    {
      size: 'w-24 h-24',
      opacity: 'opacity-50',
      rotation: 'rotate-45',
      position: 'bottom-32 left-16'
    }
  ],
  compact: [
    {
      size: 'w-24 h-24',
      opacity: 'opacity-50',
      rotation: '-rotate-15',
      position: 'top-20 right-20'
    },
    {
      size: 'w-16 h-16',
      opacity: 'opacity-50',
      rotation: 'rotate-45',
      position: 'bottom-16 left-8'
    }
  ],
  minimal: [
    {
      size: 'w-20 h-20',
      opacity: 'opacity-50',
      rotation: '-rotate-8',
      position: 'top-16 right-16'
    }
  ]
} as const;

const SmallLogoImage = memo(({ config, customOpacity }: { config: LogoConfig; customOpacity?: number }) => {
  const opacityClass = customOpacity ? `opacity-${customOpacity}` : config.opacity;
  
  return (
    <div className={`absolute ${config.position} ${config.size} ${opacityClass} ${config.rotation} transition-opacity duration-700`}>
      <Image
        src="/logo/nss-logo.svg"
        alt=""
        fill={true}
        className="w-full h-full object-contain filter saturate-0 dark:invert-0 dark:brightness-125"
        aria-hidden="true"
      />
    </div>
  );
});

SmallLogoImage.displayName = 'SmallLogoImage';

function NSSWatermarkSmall({
  variant = 'default',
  opacity
}: NSSWatermarkSmallProps) {
  const configs = SMALL_VARIANT_CONFIGS[variant];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Small decorative logos */}
      {configs.map((config, index) => (
        <SmallLogoImage 
          key={`small-logo-${index}`} 
          config={config} 
          customOpacity={opacity} 
        />
      ))}
    </div>
  );
}

export default memo(NSSWatermarkSmall);