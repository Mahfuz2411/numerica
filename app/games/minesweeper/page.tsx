import { MinesweeperGame } from "@/components/games/minesweeper-game"
import type { Metadata } from "next"
import Script from "next/script"
import { gameSchemas, breadcrumbSchema } from "@/lib/seo/structured-data"

export const metadata: Metadata = {
  title: "Minesweeper - Numerica | Play Classic Mine Sweeping Game Online",
  description: "Play the classic Minesweeper game online! Clear the board without hitting any mines. Choose from Easy, Medium, Hard, or Expert difficulty levels. Track your best times and master the game!",
  keywords: ["minesweeper", "minesweeper game", "mine sweeper online", "classic minesweeper", "minesweeper online free", "logic puzzle", "brain game", "numerica"],
  openGraph: {
    title: "Minesweeper - Play Classic Mine Sweeping Game",
    description: "Clear the board without hitting any mines! Play Minesweeper online with multiple difficulty levels.",
    type: "website",
    url: "https://numerica247.vercel.app/games/minesweeper",
    siteName: "Numerica",
    images: [
      {
        url: "/games/minesweeper-og.png",
        width: 1200,
        height: 630,
        alt: "Minesweeper Game - Numerica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Minesweeper - Numerica",
    description: "Play classic Minesweeper online! Clear the board without hitting mines.",
    images: ["/games/minesweeper-og.png"],
  },
}

export default function MinesweeperPlayPage() {
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://numerica247.vercel.app' },
    { name: 'Games', url: 'https://numerica247.vercel.app/games' },
    { name: 'Minesweeper', url: 'https://numerica247.vercel.app/games/minesweeper' }
  ])

  return (
    <>
      <Script
        id="minesweeper-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchemas.minesweeper) }}
      />
      <Script
        id="minesweeper-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <MinesweeperGame gameId="minesweeper" />
    </>
  )
}
