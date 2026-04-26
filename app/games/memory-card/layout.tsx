"use client"

import { ReactNode } from "react"
import { GameNavigation } from "@/components/games/game-navigation"

export default function MemoryCardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-2 sm:px-4 sm:py-3 md:py-4">
      <GameNavigation gameBasePath="/games/memory-card" gameName="🃏 Memory Card Game">
        {children}
      </GameNavigation>
    </div>
  )
}
