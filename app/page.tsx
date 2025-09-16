// app/page.tsx

import ElectricGridCard from "@/components/ElectricGridCard";
import { Typewriter } from "@/components/ui/typewriter";
import NSSWatermarkSmall from "@/components/NSSWatermarkSmall";

export default function Home() {
  const cards = [
    {
      title: "Links",
      href: "/links",
      description:
        "Find all college portals like results, fee payment, and more, conveniently organized in one place.",
    },
    {
      title: "Resources",
      href: "/resources",
      description:
        "Access subject-wise study materials and documents to ace your placements journey seamlessly.",
    },
    {
      title: "Placements",
      href: "/placements",
      description:
        "Stay updated with placement records, including company details and recruitment processes.",
    },
    {
      title: "Company",
      href: "/company",
      description:
        "Find resources and materials to prepare for company-specific recruitment drives and interviews",
    },
    {
      title: "Clubs",
      href: "/clubs",
      description:
        "Explore the vibrant student community and discover a wide range of clubs. ",
    },
    {
      title: "About",
      href: "/about",
      description:
        "Learn more about our mission, vision, and the team behind MITRA.",
    },
  ];

  return (
    <div className="m-4 relative">
      {/* NSS Watermark Background */}
      <NSSWatermarkSmall variant="default" />
      
      <div className="p-4 flex flex-col items-center justify-center text-center relative z-10">
        <h1
          className="text-5xl font-extrabold mb-4 text-center text-gray-800 dark:text-gray-100 font-['Poppins'] tracking-tight"
        >
          {/* <span className="inline-block align-middle mr-2" role="img" aria-label="books">📚</span> */}
          Welcome to <span className="text-cyan-500">MITRA</span>
        </h1>
        <Typewriter
          text={DEMO_TEXT}
          renderMarkdown
          className="text-lg md:text-2xl max-w-2xl mb-10 text-gray-700 dark:text-gray-300 font-['Poppins'] leading-relaxed tracking-wide mx-auto text-center prose prose-lg dark:prose-invert"
        />

        {/* Dynamic grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-8 rounded-2xl ">
          {cards.map((card, idx) => (
            <ElectricGridCard
              key={idx}
              title={
                <span className="font-semibold text-xl font-['Poppins'] text-gray-800 dark:text-gray-100">
                  {card.title}
                </span>
              }
              href={card.href}
              description={
                <span className="text-base font-['Poppins'] text-gray-600 dark:text-gray-300">
                  {card.description}
                </span>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const DEMO_TEXT = ` Your all-in-one companion for a seamless college experience.`;