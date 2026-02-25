// app/layout.tsx   (SERVER component — NO "use client" here)
import type { Metadata } from "next";
import "./globals.css";
import RootClient from "@/components/RootClient";

export const metadata: Metadata = {
  title: "Mitra KMIT",
  description: "Student Partner App",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen flex flex-col"
      >
        {/* RootClient is a client component that wraps ThemeProvider, Navbar, Splash, etc. */}
        <RootClient>{children}</RootClient>
      </body>
    </html>
  );
}
