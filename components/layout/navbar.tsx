"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Gamepad2, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Games", href: "/games" },
  { name: "Settings", href: "/settings" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobileMenu = () => setMobileOpen(false)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Gamepad2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </motion.div>
          <span className="text-lg md:text-xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Numerica
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative inline-flex whitespace-nowrap px-2 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="md:hidden">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-full"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl border-t px-4 pb-6 pt-4 sm:px-6">
          <SheetHeader className="px-0 pb-3">
            <SheetTitle>Navigate Numerica</SheetTitle>
            <SheetDescription>
              Jump between the home page, game hub, and preferences.
            </SheetDescription>
          </SheetHeader>

          <Separator />

          <div className="grid gap-2 pt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  )}
                >
                  <span>{item.name}</span>
                  {isActive && <span className="text-xs uppercase tracking-[0.18em] text-primary">Active</span>}
                </Link>
              )
            })}
          </div>

          <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Built for quick sessions, local progress, and offline play.
          </div>
        </SheetContent>
      </Sheet>
    </motion.nav>
  )
}
