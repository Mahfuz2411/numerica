import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Games - Numerica",
  description: "Browse and play exciting logical games including Tic-Tac-Toe, Memory Card, and more!",
  keywords: ["online games", "logical games", "brain games", "puzzle games", "free games"],
}

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
