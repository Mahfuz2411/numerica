import { SudokuGame } from "@/components/games/sudoku-game"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sudoku - Numerica | Play 9x9 Sudoku Puzzle Game Online",
  description: "Play the classic 9×9 Sudoku puzzle online! Fill the grid with logic and patience. Choose from Easy, Medium, Hard, or Expert difficulty. Features hints, notes mode, and timer. Perfect for puzzle lovers!",
  keywords: ["sudoku", "sudoku game", "sudoku online", "9x9 sudoku", "sudoku puzzle", "number puzzle", "logic game", "brain teaser", "numerica"],
  openGraph: {
    title: "Sudoku - Classic Number Puzzle Game",
    description: "Solve the 9×9 Sudoku puzzle! Challenge your logic with multiple difficulty levels.",
    type: "website",
    url: "https://numerica247.vercel.app/games/sudoku",
    siteName: "Numerica",
    images: [
      {
        url: "/games/sudoku-og.png",
        width: 1200,
        height: 630,
        alt: "Sudoku Game - Numerica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sudoku - Numerica",
    description: "Play classic 9×9 Sudoku online! Challenge your logic skills.",
    images: ["/games/sudoku-og.png"],
  },
}

export default function SudokuPlayPage() {
  return <SudokuGame gameId="sudoku" />
}
