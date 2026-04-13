"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Play, BookOpen, Trophy, Settings, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface GameNavigationProps {
  gameBasePath: string
  children: ReactNode
}

const tabs = [
  { id: "play", label: "Play", icon: Play, path: "" },
  { id: "rules", label: "Rules", icon: BookOpen, path: "/rules" },
  { id: "scores", label: "Scores", icon: Trophy, path: "/scores" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
]

export function GameNavigation({ gameBasePath, children }: GameNavigationProps) {
  const pathname = usePathname()

  const getActiveTab = () => {
    if (pathname === gameBasePath) return tabs[0]
    const activeTab = tabs.find((tab) => pathname === `${gameBasePath}${tab.path}`)
    return activeTab || tabs[0]
  }

  const activeTab = getActiveTab()

  return (
    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Menu className="h-4 w-4" />
              {activeTab.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname === `${gameBasePath}${tab.path}`
              return (
                <DropdownMenuItem key={tab.id} asChild>
                  <Link
                    href={`${gameBasePath}${tab.path}`}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      isActive && "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:block w-48 flex-shrink-0"
      >
        <div className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === `${gameBasePath}${tab.path}`
            return (
              <Link key={tab.id} href={`${gameBasePath}${tab.path}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    "relative overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card hover:bg-accent"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId={`activeTab-${gameBasePath}`}
                      className="absolute inset-0 bg-primary -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </div>
      </motion.aside>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1"
      >
        {children}
      </motion.div>
    </div>
  )
}
