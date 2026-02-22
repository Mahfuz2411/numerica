"use client"

import { MemoryCardGame } from "@/components/games/memory-card-game"

const GAME_ID = "memory-card"

export default function MemoryCardPlayPage() {
  return <MemoryCardGame gameId={GAME_ID} />
}
