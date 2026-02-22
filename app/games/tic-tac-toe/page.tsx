"use client"

import { TicTacToeGame } from "@/components/games/tic-tac-toe-game"

const GAME_ID = "tic-tac-toe"

export default function TicTacToePlayPage() {
  return <TicTacToeGame gameId={GAME_ID} />
}
