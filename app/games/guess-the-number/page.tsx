import type { Metadata } from "next"
import { GuessTheNumberGame } from "@/components/games/guess-the-number-game"

const GAME_ID = "guess-the-number"

export const metadata: Metadata = {
  title: "Guess the Number - Numerica | Crack the 5-Digit Code",
  description:
    "Play Guess the Number on Numerica. Try to crack the hidden 5-digit code in as few moves as possible. Get feedback after every guess and unlock achievements.",
  keywords: [
    "guess the number",
    "number code game",
    "logic game",
    "5 digit puzzle",
    "brain game",
    "numerica",
  ],
}

export default function GuessTheNumberPlayPage() {
  return <GuessTheNumberGame gameId={GAME_ID} />
}
