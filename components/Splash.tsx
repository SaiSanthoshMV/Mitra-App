"use client";

import Image from "next/image";
import { memo, useCallback, useEffect, useMemo } from "react";
import { motion, Variants, useAnimation } from "framer-motion";

type SplashProps = {
  mode?: "splash" | "loading";
  onFinish?: () => void;
  size?: number;
};

const HOLD_MS = 1000 as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const SplashImage = memo(({ size }: { size: number }) => (
  <Image
    src="/logo/mitra.png"
    alt="Mitra logo"
    width={Math.round(size * 0.9)}
    height={Math.round(size * 0.9)}
    className="object-contain"
    priority
  />
));
SplashImage.displayName = "SplashImage";

const SplashText = memo(({ textControls }: { textControls: ReturnType<typeof useAnimation> }) => (
  <motion.p
    animate={textControls}
    className="mt-1 text-sm"
    aria-hidden={false}
  >
    Initiative by <span className="font-semibold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">NSS KMIT</span>
  </motion.p>
));
SplashText.displayName = "SplashText";

function Splash({ mode = "splash", onFinish, size = 260 }: SplashProps) {
  const logoControls = useAnimation();
  const textControls = useAnimation();

  const containerStyles = useMemo(
    () => ({ width: size * 2, maxWidth: "min(92vw, 520px)" }),
    [size],
  );

  const logoAreaStyles = useMemo(
    () => ({ width: size, height: size }),
    [size],
  );

  const logoBackdropStyles = useMemo(
    () => ({ width: size * 0.96, height: size * 0.96 }),
    [size],
  );

  const playIntroSequence = useCallback(async () => {
    await logoControls.set({ scale: 0.7, opacity: 0 });
    await textControls.set({ opacity: 0, y: 8 });

    await logoControls.start({
      scale: [0.7, 1.05, 1],
      opacity: [0, 1, 1],
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    });

    await textControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    });

    await new Promise((resolve) => setTimeout(resolve, HOLD_MS));
    onFinish?.();
  }, [logoControls, textControls, onFinish]);

  const setupLoadingMode = useCallback(() => {
    logoControls.set({ scale: 1, opacity: 1 });
    textControls.set({ opacity: 1, y: 0 });
    logoControls.start({
      scale: [1, 1.02, 1],
      transition: {
        duration: 1.6,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    });
  }, [logoControls, textControls]);

  useEffect(() => {
    let canceled = false;

    const runAnimation = async () => {
      if (mode === "splash") {
        await playIntroSequence();
        if (!canceled && onFinish) onFinish();
      } else {
        setupLoadingMode();
      }
    };

    runAnimation();
    return () => {
      canceled = true;
    };
  }, [mode, playIntroSequence, setupLoadingMode, onFinish]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/70 backdrop-blur-sm">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col items-center justify-center px-6"
        style={containerStyles}
      >
        <motion.div
          animate={logoControls}
          className="relative flex items-center justify-center p-4 rounded-md"
          style={logoAreaStyles}
        >
          <div className="absolute inset-0 grid place-items-center">
            <motion.div
              className="rounded-full shadow-2xl"
              style={logoBackdropStyles}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <SplashImage size={size} />
            </motion.div>
          </div>
        </motion.div>

        <SplashText textControls={textControls} />
      </motion.div>
    </div>
  );
}

export default memo(Splash);
