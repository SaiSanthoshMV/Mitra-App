"use client";
import ElectricBorder from "@/components/blocks/Animations/ElectricBorder/ElectricBorder";
import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <div className="m-4">
      <div className="p-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-cyan-400">Welcome to MITRA</h1>
        <p className="text-xl max-w-2xl mb-8 text-gray-700 dark:text-gray-300">
          Your all-in-one companion for a seamless college experience. MITRA provides easy access to all important college links, study materials, and placement records.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-8">
          <ElectricBorder
            color="#7df9ff"
            speed={1}
            chaos={0.4}
            thickness={2}
            style={{ borderRadius: 16 }}
          >
            <a href="/links">
              <div className="p-6 text-left">
                <h2 className="text-2xl font-bold mb-2">Links</h2>
                <p className="text-gray-600 dark:text-gray-400">Find all college portals like results, fee payment, and more, conveniently organized in one place.</p>
              </div>
            </a>
          </ElectricBorder>
          <ElectricBorder
            color="#7df9ff"
            speed={1}
            chaos={0.4}
            thickness={2}
            style={{ borderRadius: 16 }}
          >
            <a href="/resources">
              <div className="p-6 text-left">
                <h2 className="text-2xl font-bold mb-2">Resources</h2>
                <p className="text-gray-600 dark:text-gray-400">Access subject-wise study materials and documents to ace your academics.</p>
              </div>
            </a>
          </ElectricBorder>
           <ElectricBorder
            color="#7df9ff"
            speed={1}
            chaos={0.4}
            thickness={2}
            style={{ borderRadius: 16 }}
          >
            <a href="/placements">
              <div className="p-6 text-left">
                <h2 className="text-2xl font-bold mb-2">Placements</h2>
                <p className="text-gray-600 dark:text-gray-400">Stay updated with placement records, including company details and recruitment processes.</p>
              </div>
            </a>
          </ElectricBorder>
        </div>
      </div>
    </div>
  );
}
