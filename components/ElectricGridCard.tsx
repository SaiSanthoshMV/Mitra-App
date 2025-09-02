"use client";

import ElectricBorder from "@/components/blocks/Animations/ElectricBorder/ElectricBorder";

type ElectricGridCardProps = {
  title: string;
  href: string;
  description: string;
};

export default function ElectricGridCard({ title, href, description }: ElectricGridCardProps) {
  return (
    <ElectricBorder
      color="#7df9ff"
      speed={1}
      chaos={0.4}
      thickness={2}
      style={{ borderRadius: 16 }}
    >
      <a href={href}>
        <div className="p-6 text-left">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </a>
    </ElectricBorder>
  );
}
