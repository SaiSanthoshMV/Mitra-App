"use client"

import { usePathname } from "next/navigation"
import Logo from "@/components/nav/logo"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import ModeToggle from "./ModeToggle"

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/links", label: "Links" },
  { href: "/resources", label: "Resources" },
  { href: "/placements", label: "Placements" },
]

export default function Component() {
  const pathname = usePathname()

  return (
    <header className="border-b px-4 md:px-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
      <div className="flex h-16 justify-between gap-4">
        {/* Left side */}
        <div className="flex gap-2">
          <div className="flex items-center md:hidden">
            {/* Mobile menu trigger */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="group size-8" variant="ghost" size="icon">
                  {/* your svg code here */}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-36 p-1 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                    {navigationLinks.map((link) => (
                      <NavigationMenuItem key={link.href} className="w-full">
                        <NavigationMenuLink
                          href={link.href}
                          className={`py-1.5 ${
                            pathname === link.href ? "text-primary font-semibold" : ""
                          }`}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
          </div>

          {/* Desktop nav */}
          <div className="flex items-center gap-6">
            <a href="/" className="text-primary hover:text-primary/90">
              <Logo />
            </a>
            <NavigationMenu className="h-full *:h-full max-md:hidden">
              <NavigationMenuList className="h-full gap-2">
                {navigationLinks.map((link) => (
                  <NavigationMenuItem key={link.href} className="h-full">
                    <NavigationMenuLink
                      href={link.href}
                      className={`text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent! ${
                        pathname === link.href
                          ? "border-b-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
