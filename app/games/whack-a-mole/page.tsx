import { WhackAMoleGame } from "@/components/games/whack-a-mole-game"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Whack-a-Mole - Numerica | Test Your Reflexes in Classic Arcade Game",
  description: "Test your reflexes in this arcade classic! Click the moles before they disappear. Play in Easy, Medium, or Hard mode. Track your high scores and improve your reaction time!",
  keywords: ["whack a mole", "whack-a-mole game", "arcade game", "reflex game", "reaction time game", "clicking game", "arcade classic", "numerica"],
  openGraph: {
    title: "Whack-a-Mole - Classic Arcade Game",
    description: "Test your reflexes! Click the moles before they disappear in this classic arcade game.",
    type: "website",
    url: "https://numerica247.vercel.app/games/whack-a-mole",
    siteName: "Numerica",
    images: [
      {
        url: "/games/whack-a-mole-og.png",
        width: 1200,
        height: 630,
        alt: "Whack-a-Mole Game - Numerica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Whack-a-Mole - Numerica",
    description: "Test your reflexes! Click the moles in this classic arcade game.",
    images: ["/games/whack-a-mole-og.png"],
  },
}

export default function WhackAMolePlayPage() {
  return <WhackAMoleGame gameId="whack-a-mole" />
}
