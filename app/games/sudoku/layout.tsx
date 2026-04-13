"use client"

import { ReactNode } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { GameNavigation } from "@/components/games/game-navigation"

export default function SudokuLayout({ children }: { children: ReactNode }) {
  return (
    <MainLayout>
      <div className="container px-4 py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-center md:text-left">
          🔢 Sudoku
        </h1>

        <GameNavigation gameBasePath="/games/sudoku">
          {children}
        </GameNavigation>
      </div>
    </MainLayout>
  )
}
