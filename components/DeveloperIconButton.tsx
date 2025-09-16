// components/DeveloperIconButton.tsx

"use client";

import { useState } from "react";
import DeveloperDialog from "@/components/DeveloperDialog";
import { Rocket } from "lucide-react";

type Props = {
  className?: string;
  ariaLabel?: string;
};

export default function DeveloperIconButton({ className = "", ariaLabel = "Contact developer" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => setOpen(true)}
        className={
          `inline-flex items-center justify-center p-2 rounded-full
           text-gray-500 dark:text-gray-400
           hover:text-cyan-400 dark:hover:text-cyan-300
           focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50
           transition-colors duration-150 ` + className
        }
      >
        <Rocket className="w-5 h-5" size={16} strokeWidth={1} />
      </button>

      {/* Reuseable dialog component (keeps original behavior) */}
      <DeveloperDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}