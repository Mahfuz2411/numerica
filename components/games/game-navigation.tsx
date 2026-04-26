"use client"

import { ReactNode, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Play, BookOpen, Trophy, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface GameNavigationProps {
  gameBasePath: string
  gameName: string
  children: ReactNode
}

const tabs = [
  { id: "play", label: "Play", icon: Play, path: "" },
  { id: "rules", label: "Rules", icon: BookOpen, path: "/rules" },
  { id: "scores", label: "Scores", icon: Trophy, path: "/scores" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
]

export function GameNavigation({ gameBasePath, gameName, children }: GameNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [showExitModal, setShowExitModal] = useState(false)

  const handleExitClick = () => {
    window.dispatchEvent(new CustomEvent("numerica:pause-game", { detail: { gameBasePath } }))
    setShowExitModal(true)
  }

  const confirmExit = () => {
    setShowExitModal(false)
    router.push("/games")
  }

  return (
    <div className="flex flex-col gap-2 sm:gap-3 md:flex-row md:gap-4">
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full shrink-0 md:w-56"
      >
        <div className="rounded-xl border bg-card/80 p-2.5 shadow-sm md:p-3">
          <div className="mb-2.5 flex items-center justify-between gap-2 md:block">
            <h2 className="text-sm font-semibold text-foreground md:text-base">{gameName}</h2>
            <button
              type="button"
              onClick={handleExitClick}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border bg-background px-2 py-1 text-xs font-medium hover:bg-accent md:hidden"
            >
              <LogOut className="h-3.5 w-3.5" />
              Exit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname === `${gameBasePath}${tab.path}`

              return (
                <Link
                  key={tab.id}
                  href={`${gameBasePath}${tab.path}`}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors md:justify-start md:px-3.5 md:py-2.5",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-background hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </Link>
              )
            })}
          </div>

          <button
            type="button"
            onClick={handleExitClick}
            className="mt-2.5 hidden w-full cursor-pointer items-center justify-start gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent md:inline-flex"
          >
            <LogOut className="h-4 w-4" />
            Exit
          </button>
        </div>
      </motion.aside>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1"
      >
        {children}
      </motion.div>

      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border bg-background p-5 shadow-2xl">
            <h3 className="text-lg font-semibold">Exit Game?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Running game will be paused, but this session will not be saved after exit.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowExitModal(false)}>
                Cancel
              </Button>
              <Button onClick={confirmExit}>Exit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
