"use client"

import { ReactNode } from "react"
import { GameNavigation } from "@/components/games/game-navigation"

export default function GuessTheNumberLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:py-6 md:py-8">
      <GameNavigation gameBasePath="/games/guess-the-number" gameName="🔐 Guess the Number">
        {children}
      </GameNavigation>
    </div>
  )
}
