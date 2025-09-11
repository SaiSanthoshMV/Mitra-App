// "use client";

// import Image from "next/image";
// import { useEffect } from "react";
// import { motion, Variants, useAnimation } from "framer-motion";

// type SplashProps = {
//   /** 'splash' plays the 2s intro (then stops). 'loading' keeps a subtle loop. */
//   mode?: "splash" | "loading";
//   /** called when splash (mode='splash') finishes (after ~2s) */
//   onFinish?: () => void;
//   /** size of the square logo area in px */
//   size?: number;
// };

// export default function Splash({ mode = "splash", onFinish, size = 260 }: SplashProps) {
//   const leftControls = useAnimation();
//   const rightControls = useAnimation();
//   const logoControls = useAnimation();
//   const textControls = useAnimation();

//   useEffect(() => {
//     let finished = false;

//     async function runIntro() {
//       // slide hands in
//       await Promise.all([
//         leftControls.start("in"),
//         rightControls.start("in"),
//       ]);

//       // handshake pulse (quick)
//       await Promise.all([
//         leftControls.start("pulse"),
//         rightControls.start("pulse"),
//       ]);

//       // reveal logo and text
//       await Promise.all([
//         logoControls.start("visible"),
//         textControls.start("visible"),
//       ]);

//       // finish callback after remaining time so total ~2s
//       if (mode === "splash") {
//         // ensure a minimum total time ~2000ms
//         setTimeout(() => {
//           if (!finished) {
//             finished = true;
//             onFinish && onFinish();
//           }
//         }, 300); // the earlier animations take ~1.7s; this keeps it close to 2s
//       }
//     }

//     if (mode === "splash") {
//       runIntro();
//     } else {
//       // loading mode: bring hands together then idle pulse loop
//       (async () => {
//         await Promise.all([
//           leftControls.start("in"),
//           rightControls.start("in"),
//         ]);
//         logoControls.start("visible");
//         textControls.start("visible");
//         leftControls.start("idle");
//         rightControls.start("idle");
//       })();
//     }

//     return () => {
//       finished = true;
//     };
//   }, [mode, leftControls, rightControls, logoControls, textControls, onFinish]);

//   const handLeftVariants: Variants = {
//     hidden: { x: -140, scale: 1, opacity: 0 },
//     in: { x: 0, opacity: 1, transition: { duration: 0.7, ease: [0.2, 0.9, 0.2, 1] } },
//     pulse: {
//       scale: [1, 0.98, 1.02, 1],
//       transition: { duration: 0.35, times: [0, 0.45, 0.8, 1] },
//     },
//     idle: {
//       scale: [1, 1.02, 1],
//       transition: { duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
//     },
//   };

//   const handRightVariants: Variants = {
//     hidden: { x: 140, scale: 1, opacity: 0 },
//     in: { x: 0, opacity: 1, transition: { duration: 0.7, ease: [0.2, 0.9, 0.2, 1] } },
//     pulse: {
//       scale: [1, 1.02, 0.98, 1],
//       transition: { duration: 0.35, times: [0, 0.45, 0.8, 1] },
//     },
//     idle: {
//       scale: [1, 0.98, 1],
//       transition: { duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
//     },
//   };

//   const logoVariants: Variants = {
//     hidden: { opacity: 0, scale: 0.96 },
//     visible: { opacity: 1, scale: 1, transition: { delay: 0.75, duration: 0.45, ease: "circOut" } },
//   };

//   const textVariants: Variants = {
//     hidden: { opacity: 0, y: 8 },
//     visible: { opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.45, ease: "easeOut" } },
//   };

//   // color tokens (tailwind friendly)
//   // logo area background will auto-adapt to theme if you place the component inside a dark container

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
//       <div className="flex flex-col items-center justify-center gap-4 px-6">
//         {/* visual area */}
//         <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
//           {/* left stylized hand block */}
//           <motion.div
//             initial="hidden"
//             animate={leftControls}
//             variants={handLeftVariants}
//             className="absolute left-0 flex items-center justify-center"
//             style={{ width: size * 0.6, height: size * 0.46 }}
//             aria-hidden
//           >
//             {/* stylized left hand (simple geometries so it remains crisp at any size) */}
//             <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
//               {/* sleeve */}
//               <rect x="6" y="6" width="70" height="40" rx="6" fill="#22c1c3" opacity="0.95" />
//               {/* palm / fingers simplified */}
//               <g transform="translate(18,32)">
//                 <rect x="0" y="0" width="82" height="40" rx="14" fill="white" stroke="#073642" strokeWidth="3" />
//                 {/* finger-tips as small rounded rects */}
//                 <rect x="24" y="-6" width="10" height="18" rx="4" fill="#f5f5f7" />
//                 <rect x="36" y="-6" width="10" height="18" rx="4" fill="#f5f5f7" />
//                 <rect x="48" y="-6" width="10" height="18" rx="4" fill="#f5f5f7" />
//               </g>
//             </svg>
//           </motion.div>

//           {/* right stylized hand block */}
//           <motion.div
//             initial="hidden"
//             animate={rightControls}
//             variants={handRightVariants}
//             className="absolute right-0 flex items-center justify-center"
//             style={{ width: size * 0.6, height: size * 0.46 }}
//             aria-hidden
//           >
//             <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
//               {/* sleeve */}
//               <rect x="124" y="6" width="70" height="40" rx="6" fill="#ff9830" opacity="0.95" />
//               {/* palm / fingers simplified - mirrored */}
//               <g transform="scale(-1,1) translate(-120,32)">
//                 <rect x="0" y="0" width="82" height="40" rx="14" fill="white" stroke="#073642" strokeWidth="3" />
//                 <rect x="24" y="-6" width="10" height="18" rx="4" fill="#f5f5f7" />
//                 <rect x="36" y="-6" width="10" height="18" rx="4" fill="#f5f5f7" />
//                 <rect x="48" y="-6" width="10" height="18" rx="4" fill="#f5f5f7" />
//               </g>
//             </svg>
//           </motion.div>

//           {/* meeting point ripple dots (subtle) */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={mode === "loading" ? { opacity: [0.85, 0.95, 0.85] } : { opacity: 1 }}
//             transition={{ duration: mode === "loading" ? 1.6 : 0 }}
//             className="absolute z-10 flex items-center justify-center"
//             aria-hidden
//           >
//             <svg viewBox="0 0 120 120" className="w-36 h-36">
//               <motion.circle
//                 cx="60"
//                 cy="60"
//                 r="8"
//                 fill="#22d3ee"
//                 initial={{ opacity: 0, r: 2 }}
//                 animate={{ opacity: [0.9, 0.15, 0], r: [6, 18, 30] }}
//                 transition={{ repeat: mode === "loading" ? Infinity : 0, duration: 1.4 }}
//               />
//               <motion.circle
//                 cx="60"
//                 cy="60"
//                 r="4"
//                 fill="#ffb86b"
//                 initial={{ opacity: 0, r: 1 }}
//                 animate={{ opacity: [0.9, 0.1, 0], r: [4, 12, 20] }}
//                 transition={{ repeat: mode === "loading" ? Infinity : 0, duration: 1.2, delay: 0.14 }}
//               />
//             </svg>
//           </motion.div>

//           {/* logo image fades in on reveal */}
//           <motion.div
//             initial="hidden"
//             animate={logoControls}
//             variants={logoVariants}
//             className="absolute z-20 flex items-center justify-center"
//             style={{ width: size * 0.78, height: size * 0.78 }}
//           >
//             {/* Replace with your real logo placed at /public/logo/mitra.png */}
//             <Image
//               src="/logo/mitra.png"
//               alt="Mitra logo"
//               width={Math.round(size * 0.78)}
//               height={Math.round(size * 0.78)}
//               className="object-contain rounded"
//             />
//           </motion.div>
//         </div>

//         {/* texts */}
//         <motion.h1 initial="hidden" animate={textControls} variants={textVariants} className="mt-2 text-3xl font-extrabold text-cyan-400">
//           MITRA
//         </motion.h1>
//         <motion.p initial="hidden" animate={textControls} variants={textVariants} className="text-sm text-slate-200/90">
//           Initiative by NSS KMIT
//         </motion.p>
//       </div>
//     </div>
//   );
// }
"use client";

/*
  File: components/Splash.tsx
  Updated: Zoom-in splash animation (2s) + hold (1s) = 3s total

  Behavior:
  - mode="splash": Logo scales up (zoom-in) and fades in across 2 seconds.
    The MITRA title and the subtext "Initiative by NSS KMIT" fade/slide in during the latter part of
    that 2s window so the whole reveal completes at ~2s.
  - After the 2s reveal, the full composition remains visible for 1s (hold). After that the
    component calls onFinish() so the parent (RootClient) can remove the splash and show the app.
  - mode="loading": A subtle, looping pulse is applied to the logo (for overlay loading states).

  Notes:
  - Uses framer-motion: install `npm i framer-motion` if you haven't already.
  - Place your logo in `/public/logo/mitra.png` (SVG recommended for crispness). The component
    uses next/image for optimal loading.
  - IMPORTANT: If your RootClient currently uses a fallback timeout like `setTimeout(..., 2200)`
    update that fallback to at least `3200` (or remove it) so it doesn't prematurely hide the
    splash. See instructions below.
*/

import Image from "next/image";
import { useEffect } from "react";
import { motion, Variants, useAnimation } from "framer-motion";

type SplashProps = {
  mode?: "splash" | "loading";
  onFinish?: () => void;
  size?: number; // controls the visual area size in px
};

const INTRO_MS = 2000; // zoom + text reveal total
const HOLD_MS = 1000; // hold after reveal

export default function Splash({ mode = "splash", onFinish, size = 260 }: SplashProps) {
  const logoControls = useAnimation();
  const textControls = useAnimation();

  useEffect(() => {
    let canceled = false;

    async function playIntro() {
      // reset states
      await logoControls.set({ scale: 0.7, opacity: 0 });
      await textControls.set({ opacity: 0, y: 8 });

      // logo: zoom-in with a little overshoot
      await logoControls.start({
        scale: [0.7, 1.05, 1],
        opacity: [0, 1, 1],
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
      });

      // text: reveal so both logo + text complete by INTRO_MS (remaining ~0.8s)
      await textControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
      });

      // hold for HOLD_MS then finish
      await new Promise((res) => setTimeout(res, HOLD_MS));

      if (!canceled) {
        onFinish && onFinish();
      }
    }

    if (mode === "splash") {
      playIntro();
    } else {
      // loading: show composition immediately and pulse
      logoControls.set({ scale: 1, opacity: 1 });
      textControls.set({ opacity: 1, y: 0 });
      logoControls.start({
        scale: [1, 1.02, 1],
        transition: { duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
      });
    }

    return () => {
      canceled = true;
    };
  }, [mode, logoControls, textControls, onFinish]);

  // Visual variants for minor interactions (not used heavily, but kept for clarity)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/70 backdrop-blur-sm">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col items-center justify-center px-6"
        style={{ width: size * 2, maxWidth: "min(92vw, 520px)" }}
      >
        {/* Logo area */}
        <motion.div
          animate={logoControls}
          className="relative flex items-center justify-center p-4 rounded-md"
          style={{ width: size, height: size }}
        >
          <div className="absolute inset-0 grid place-items-center">
            <motion.div
              className="rounded-full shadow-2xl"
              style={{ width: size * 0.96, height: size * 0.96 }}
              // subtle radial backdrop to lift the logo
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* the actual logo image (SVG/PNG) */}
              <Image
                src="/logo/mitra.png"
                alt="Mitra logo"
                width={Math.round(size * 0.9)}
                height={Math.round(size * 0.9)}
                className="object-contain"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Title & subtitle - appear after/while zoom finishes
        <motion.h1
          animate={textControls}
          className="mt-4 text-4xl font-extrabold text-cyan-400 tracking-tight"
          style={{ WebkitFontSmoothing: "antialiased" }}
        >
          MITRA
        </motion.h1> */}

        <motion.p
          animate={textControls}
          className="mt-1 text-sm text-slate-200/90"
          aria-hidden={false}
        >
          Initiative by NSS KMIT
        </motion.p>
      </motion.div>
    </div>
  );
}

/*
  -----------------------
  Integration notes
  -----------------------
  - Ensure you call <Splash mode="splash" onFinish={() => setShowSplash(false)} /> from a client
    wrapper as shown in the earlier RootClient example.
  - IMPORTANT: If your RootClient still uses `setTimeout(..., 2200)` to force-hide the splash,
    update that fallback to at least `3200` (3.2s) or remove it completely. The splash now
    self-terminates after ~3000ms.

  Example quick change in RootClient.tsx (replace the old 2200):

  // old: const t = setTimeout(() => setShowSplash(false), 2200)
  const t = setTimeout(() => setShowSplash(false), 3200)

  or remove the fallback entirely if you rely solely on the Splash's onFinish.

  -----------------------
  Want further polish?
  - I can add a small fade-out before onFinish so the splash smoothly fades instead of abruptly
    disappearing (recommended for production polish).
  - I can also provide a Lottie export plan or generate a motion mockup video for preview.
*/
