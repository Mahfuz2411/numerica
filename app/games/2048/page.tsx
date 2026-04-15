import { Game2048 } from "@/components/games/2048-game"

const GAME_ID = "2048"

export default function Play2048Page() {
  return <Game2048 gameId={GAME_ID} />
}
