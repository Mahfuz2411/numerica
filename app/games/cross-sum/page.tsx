import type { Metadata } from "next"
import { CrossSumGame } from "@/components/games/cross-sum-game"

const GAME_ID = "cross-sum"

export const metadata: Metadata = {
  title: "Cross Sum - Numerica | Remove Extra Numbers to Match Sums",
  description:
    "Play Cross Sum on Numerica. Remove extra numbers so every row and column matches the target sums. Includes Easy, Medium, and Hard modes.",
  keywords: [
    "cross sum",
    "sum puzzle",
    "number puzzle",
    "logic game",
    "brain game",
    "numerica",
  ],
}

export default function CrossSumPlayPage() {
  return <CrossSumGame gameId={GAME_ID} />
}
