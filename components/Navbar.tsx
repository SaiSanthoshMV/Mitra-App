"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Home, Link as LinkIcon, BookOpen, GraduationCap, Building2, Users, Info, LogOut, User, FileText } from "lucide-react"
import Logo from "@/components/nav/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { AnimatedThemeToggler } from "./magicui/animated-theme-toggler"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"

const navigationLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/links", label: "Links", icon: LinkIcon },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/placements", label: "Placements", icon: GraduationCap },
  { href: "/company", label: "Company", icon: Building2 },
  { href: "/materials", label: "Materials", icon: FileText },
  { href: "/clubs", label: "Clubs", icon: Users },
  { href: "/about", label: "About", icon: Info }
]

export default function Component() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/materials' })
  }

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="border-b px-4 md:px-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur relative z-50">
        <div className="flex h-16 justify-between gap-4">
          {/* Left side */}
          <div className="flex gap-2">
            <div className="flex items-center md:hidden">
              {/* Enhanced Mobile menu trigger */}
              <Button
                className="group size-10 relative z-50"
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                  {/* Animated hamburger lines */}
                  <span
                    className={`block h-0.5 w-6 bg-current transition-all duration-300 transform ${isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1.5'
                      }`}
                  />
                  <span
                    className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                      }`}
                  />
                  <span
                    className={`block h-0.5 w-6 bg-current transition-all duration-300 transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1.5'
                      }`}
                  />
                </div>
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>

            {/* Desktop nav with icons */}
            <div className="flex items-center gap-6">
              <Link href="/" className="text-primary hover:text-primary/90 relative z-50 rounded-full">
                <Logo />
              </Link>
              <NavigationMenu className="h-full *:h-full max-md:hidden">
                <NavigationMenuList className="h-full gap-1">
                  {navigationLinks.map((link) => {
                    const IconComponent = link.icon
                    return (
                      <NavigationMenuItem key={link.href} className="h-full">
                        <NavigationMenuLink
                          href={link.href}
                          className={`font-['Playfair_Display'] text-lg text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent px-3 py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent flex items-center gap-2 transition-all duration-200 group ${pathname === link.href
                            ? "border-b-primary text-primary"
                            : "text-muted-foreground"
                            }`}
                        >
                          <IconComponent
                            size={18}
                            className={`transition-all duration-200 ${pathname === link.href
                              ? "text-primary scale-110"
                              : "text-muted-foreground group-hover:text-primary group-hover:scale-105"
                              }`}
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 relative z-50">
            {/* Show user info and logout if logged in */}
            {session && session.user?.email && (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border border-cyan-200 dark:border-cyan-800">
                  <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                    {session.user.email.split('@')[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="ml-2">Logout</span>
                </Button>
              </div>
            )}
            <AnimatedThemeToggler />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Enhanced Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-background/95 backdrop-blur-lg border-r shadow-2xl z-40 md:hidden transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Menu Header */}
        <div className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <Logo />
            </div>
            <div className="text-sm text-muted-foreground font-medium">Navigation</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>

        {/* Navigation Links with Icons */}
        <nav className="flex flex-col py-6">
          {navigationLinks.map((link, index) => {
            const IconComponent = link.icon
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative group px-6 py-4 font-['Playfair_Display'] text-lg transition-all duration-200 hover:bg-accent/50 hover:translate-x-1 ${pathname === link.href
                  ? "text-primary bg-primary/10 border-r-4 border-primary shadow-lg"
                  : "text-foreground hover:text-primary border-r-4 border-transparent hover:border-primary/30"
                  }`}
                style={{
                  animationDelay: `${index * 75}ms`,
                  animation: isMobileMenuOpen ? 'slideInFromLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none'
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Enhanced Icon Design */}
                  <div className={`p-2 rounded-xl transition-all duration-200 ${pathname === link.href
                    ? "bg-primary/20 text-primary scale-110 shadow-lg"
                    : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105"
                    }`}>
                    <IconComponent size={20} />
                  </div>

                  <div className="flex flex-col">
                    <span className="font-medium">
                      {link.label}
                    </span>
                    {/* Subtle description for mobile */}
                    <span className="text-xs text-muted-foreground/70 font-normal">
                      {link.href === "/" && "Welcome page"}
                      {link.href === "/about" && "Learn more about us"}
                      {link.href === "/links" && "Useful resources"}
                      {link.href === "/resources" && "Study materials"}
                      {link.href === "/placements" && "Career opportunities"}
                      {link.href === "/company" && "Corporate info"}
                      {link.href === "/materials" && "Notes & PDFs"}
                      {link.href === "/clubs" && "Student organizations"}
                    </span>

                    {/* Enhanced underline animation */}
                    <span className={`h-0.5 bg-gradient-to-r from-primary to-primary/50 transition-all duration-300 mt-1 ${pathname === link.href
                      ? "w-full opacity-100"
                      : "w-0 opacity-0 group-hover:w-3/4 group-hover:opacity-100"
                      }`} />
                  </div>

                  {/* Arrow indicator for active item */}
                  {pathname === link.href && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </a>
            )
          })}
        </nav>

        {/* Enhanced Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-gradient-to-r from-muted/20 to-muted/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span className="text-xs text-muted-foreground font-medium">Menu</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{navigationLinks.length}</span>
              <span className="text-xs text-muted-foreground/60">pages</span>
            </div>
          </div>
          <div className="mt-2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        </div>
      </div>

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}