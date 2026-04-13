import { MemoryCardGame } from "@/components/games/memory-card-game"
import type { Metadata } from "next"

const GAME_ID = "memory-card"

export const metadata: Metadata = {
  title: "Memory Card Game - Numerica | Test Your Memory Skills Online",
  description: "Test your memory with our engaging card matching game! Flip cards to find matching pairs. Choose from Easy (8 cards), Medium (12 cards), or Hard (16 cards) difficulty. Train your brain!",
  keywords: ["memory game", "memory card game", "matching game", "card matching", "memory test", "brain training", "concentration game", "numerica"],
  openGraph: {
    title: "Memory Card Game - Test Your Memory",
    description: "Challenge your memory! Flip cards and find matching pairs in this classic memory game.",
    type: "website",
    url: "https://numerica247.vercel.app/games/memory-card",
    siteName: "Numerica",
    images: [
      {
        url: "/games/memory-card-og.png",
        width: 1200,
        height: 630,
        alt: "Memory Card Game - Numerica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memory Card Game - Numerica",
    description: "Test your memory! Find matching pairs in this classic card game.",
    images: ["/games/memory-card-og.png"],
  },
}

export default function MemoryCardPlayPage() {
  return <MemoryCardGame gameId={GAME_ID} />
}
