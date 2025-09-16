// components/ElectricGridCard.tsx
"use client";

import ElectricBorder from "@/components/blocks/Animations/ElectricBorder/ElectricBorder";
import React from "react";

type ElectricGridCardProps = {
  title: React.ReactNode;
  href: string;
  description: React.ReactNode;
};

export default function ElectricGridCard({ title, href, description }: ElectricGridCardProps) {
  return (
    <div className="transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl h-full rounded-3xl">
      <ElectricBorder
        color="#7df9ff"
        speed={1}
        chaos={0.3}
        thickness={2}
        style={{ borderRadius: 24 }}
      >
        <a href={href} className="block h-full">
          <div className="p-6 text-left transition-all duration-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 h-full min-h-[165px] flex flex-col justify-between rounded-3xl">
            <div>
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
            </div>
          </div>
        </a>
      </ElectricBorder>
    </div>
  );
}