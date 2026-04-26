"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Play, BookOpen, Trophy, Settings, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

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
      {/* Mobile Menu */}
      <div className="md:hidden w-full rounded-xl border bg-card/80 p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === `${gameBasePath}${tab.path}`
            return (
              <Link
                key={tab.id}
                href={`${gameBasePath}${tab.path}`}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-background hover:bg-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:block w-48 shrink-0"
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
                  <Icon className="h-5 w-5 shrink-0" />
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
