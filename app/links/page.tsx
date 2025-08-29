import { Button } from "@/components/ui/button";
import {
  Globe,
  GraduationCap,
  Telescope,
  Calendar,
  Youtube,
  BookOpen,
  Building,
  MoreHorizontal,
  LinkIcon,
  Link2Icon,
} from "lucide-react";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}

const links: LinkItem[] = [
  {
    id: "official-site",
    title: "Official Site",
    url: "https://example.com",
    icon: Globe,
  },
  {
    id: "tesseract",
    title: "Tesseract",
    url: "https://tesseract.example.com",
    icon: Building,
  },
  {
    id: "project-school",
    title: "ProjectSchool",
    url: "https://projectschool.example.com",
    icon: GraduationCap,
  },
  {
    id: "attendance",
    title: "Attendance",
    url: "https://attendance.example.com",
    icon: Calendar,
  },
  {
    id: "telescope",
    title: "Telescope",
    url: "https://telescope.example.com",
    icon: Telescope,
  },
  {
    id: "study-resource",
    title: "Study Resource",
    url: "https://study.example.com",
    icon: BookOpen,
  },
  {
    id: "kmit-yt",
    title: "KMIT YT",
    url: "https://youtube.com/kmit",
    icon: Youtube,
  },
];

export default function Page() {
  return (
    <div
      className="min-h-screen px-6 py-8"
    //   style={{ backgroundColor: "#c8e6c9" }}
    >
      <div className="max-w-md mx-auto">
        <div className="space-y-4">
          {links.map((link) => {
            return (
              <Button
                key={link.id}
                className="w-full h-16 justify-center relative hover:opacity-60 transition-opacity duration-200 border-0 shadow-none rounded-2xl"
                // style={{
                //   color: "#2e7d32",
                // }}
                asChild
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center relative"
                >
                  <span className="text-base font-medium">
                    {link.title}
                  </span>
                  <Link2Icon
                    // size={20}
                    className="absolute right-4 text-current opacity-70"
                  />
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}