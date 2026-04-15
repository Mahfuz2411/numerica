"use client"

import { ReactNode } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { GameNavigation } from "@/components/games/game-navigation"

export default function GuessTheNumberLayout({ children }: { children: ReactNode }) {
  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:py-6 md:py-8">
        <h1 className="mb-3 text-center text-2xl font-bold sm:mb-4 md:mb-6 md:text-left md:text-3xl">
          🔐 Guess the Number
        </h1>

        <GameNavigation gameBasePath="/games/guess-the-number">
          {children}
        </GameNavigation>
      </div>
    </MainLayout>
  )
}
