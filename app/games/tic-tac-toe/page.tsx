import { TicTacToeGame } from "@/components/games/tic-tac-toe-game"
import type { Metadata } from "next"

const GAME_ID = "tic-tac-toe"

export const metadata: Metadata = {
  title: "Tic-Tac-Toe - Numerica | Play Classic X and O Game Online",
  description: "Play the timeless Tic-Tac-Toe game online! Challenge your strategic thinking with this classic 3x3 board game. Choose Easy, Medium, or Hard difficulty. Perfect for quick brain training!",
  keywords: ["tic-tac-toe", "tic tac toe game", "X and O game", "noughts and crosses", "tic tac toe online", "strategy game", "brain game", "numerica"],
  openGraph: {
    title: "Tic-Tac-Toe - Classic Strategy Game",
    description: "Challenge your mind with classic Tic-Tac-Toe! Play online with multiple difficulty levels.",
    type: "website",
    url: "https://numerica247.vercel.app/games/tic-tac-toe",
    siteName: "Numerica",
    images: [
      {
        url: "/games/tic-tac-toe-og.png",
        width: 1200,
        height: 630,
        alt: "Tic-Tac-Toe Game - Numerica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tic-Tac-Toe - Numerica",
    description: "Play classic Tic-Tac-Toe online! Challenge your strategy skills.",
    images: ["/games/tic-tac-toe-og.png"],
  },
}

export default function TicTacToePlayPage() {
  return <TicTacToeGame gameId={GAME_ID} />
}
