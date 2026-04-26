"use client"

import { ReactNode } from "react"
import { GameNavigation } from "@/components/games/game-navigation"

export default function Game2048Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-2 sm:px-4 sm:py-3 md:py-4">
      <GameNavigation gameBasePath="/games/2048" gameName="🎲 2048">
        {children}
      </GameNavigation>
    </div>
  )
}
