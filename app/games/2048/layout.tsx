"use client"

import { ReactNode } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { GameNavigation } from "@/components/games/game-navigation"

export default function Game2048Layout({ children }: { children: ReactNode }) {
  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-center md:text-left">
          🎲 2048
        </h1>

        <GameNavigation gameBasePath="/games/2048">
          {children}
        </GameNavigation>
      </div>
    </MainLayout>
  )
}
