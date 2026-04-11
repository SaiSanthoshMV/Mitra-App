// components/DeveloperDialog.tsx
"use client";

import React, { memo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "@/components/ProfileCard";
import { DockDemo } from "../app/about/contact";

interface DeveloperDialogProps {
  open: boolean;
  onClose: () => void;
}

// Optimized close button component
const CloseButton = memo(React.forwardRef<HTMLButtonElement, { onClose: () => void }>(
  ({ onClose }, ref) => (
    <button
      ref={ref}
      onClick={onClose}
      aria-label="Close contact card"
      className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-full text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )
));

CloseButton.displayName = 'CloseButton';

// Optimized header component
const DialogHeader = memo(() => (
  <div className="flex items-center gap-4">
    <div className="w-14 h-14 rounded-xl bg-cyan-400/20 flex items-center justify-center">
      <svg
        className="w-8 h-8 text-cyan-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div>
      <h3 className="text-lg font-semibold">Developer</h3>
      <p className="text-sm text-slate-500 dark:text-slate-300">Reach out for feedback, suggestions or bugs.</p>
    </div>
  </div>
));

DialogHeader.displayName = 'DialogHeader';

// Optimized ProfileCard wrapper
const ProfileCardSection = memo(() => {
  const handleContactClick = useCallback(() => {
    window.open("https://www.linkedin.com/in/saisanthoshmv/", "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className=" mx-auto w-fit scale-82">
      <ProfileCard
        name="M Sai Santhosh"
        title="Engineer KMIT'26"
        handle="SaiSanthoshMV"
        status="Online"
        contactText="Contact Me"
        iconUrl="/code-xml.png"
        avatarUrl="/dev.png"
        miniAvatarUrl="/dev.png"
        behindGradient={undefined}
        innerGradient={undefined}
        showUserInfo={true}
        enableTilt={true}
        enableMobileTilt={true}
        mobileTiltSensitivity={0.8}
        onContactClick={handleContactClick}
      />
      <div>
        <DockDemo />
      </div>
    </div>
  );
});

ProfileCardSection.displayName = 'ProfileCardSection';

function DeveloperDialog({ open, onClose }: DeveloperDialogProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  // Focus management with optimization
  useEffect(() => {
    if (open) {
      lastActiveRef.current = document.activeElement as HTMLElement;
      const timeoutId = setTimeout(() => closeBtnRef.current?.focus(), 0);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      lastActiveRef.current?.focus?.();
    }
  }, [open, handleKeyDown]);

  // Optimized focus trap
  useEffect(() => {
    if (!open || !modalRef.current) return;

    const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const currentModal = modalRef.current;
    currentModal?.addEventListener("keydown", handleTabKey);
    return () => currentModal?.removeEventListener("keydown", handleTabKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          aria-hidden={!open}
          role="presentation"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ y: 10, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-[9999] h-[90%] max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-800/40 shadow-2xl p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Contact developer"
            onClick={handleContentClick}
          >
            <CloseButton ref={closeBtnRef} onClose={onClose} />

            <DialogHeader />

            <ProfileCardSection />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(DeveloperDialog);
