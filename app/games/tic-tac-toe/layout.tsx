"use client"

import { ReactNode } from "react"
import { GameNavigation } from "@/components/games/game-navigation"

export default function TicTacToeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:py-6 md:py-8">
      <GameNavigation gameBasePath="/games/tic-tac-toe" gameName="🎯 Tic-Tac-Toe">
        {children}
      </GameNavigation>
    </div>
  )
}
