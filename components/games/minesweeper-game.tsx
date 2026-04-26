"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Bomb, Flag, Clock, Trophy, RotateCcw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  createBoard,
  createEmptyBoard,
  revealCell,
  toggleFlag,
  checkWin,
  revealAllMines,
  countFlags,
  DIFFICULTIES,
  type Cell,
  type Difficulty,
} from "@/lib/games/minesweeper"
import { gameDB } from "@/lib/db/game-db"
import { gameSettings } from "@/lib/db/game-settings"

interface MinesweeperGameProps {
  gameId: string
}

export function MinesweeperGame({ gameId }: MinesweeperGameProps) {
  const [sessionState, setSessionState] = useState<"idle" | "playing" | "paused">("idle")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [board, setBoard] = useState<Cell[][]>([])
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isFirstClick, setIsFirstClick] = useState(true)

  const config = DIFFICULTIES[difficulty]
  const flags = countFlags(board)
  const remainingMines = config.mines - flags

  const resetGame = useCallback(() => {
    const config = DIFFICULTIES[difficulty]
    setBoard(createEmptyBoard(config.rows, config.cols))
    setGameState("playing")
    setStartTime(null)
    setCurrentTime(0)
    setIsFirstClick(true)
  }, [difficulty])

  useEffect(() => {
    setMounted(true)
    resetGame()
  }, [resetGame])

  useEffect(() => {
    if (difficulty) {
      resetGame()
    }
  }, [difficulty, resetGame])

  useEffect(() => {
    if (sessionState === "playing" && gameState === "playing" && startTime) {
      const interval = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [gameState, startTime, sessionState])

  useEffect(() => {
    const onPause = () => {
      setSessionState((prev) => (prev === "playing" ? "paused" : prev))
    }

    window.addEventListener("numerica:pause-game", onPause)
    return () => window.removeEventListener("numerica:pause-game", onPause)
  }, [])

  useEffect(() => {
    const savedBestTime = localStorage.getItem(`${gameId}-${difficulty}-best-time`)
    if (savedBestTime) {
      setBestTime(parseInt(savedBestTime, 10))
    } else {
      setBestTime(null)
    }
  }, [difficulty, gameId])

  useEffect(() => {
    if (gameState === "won" && currentTime > 0 && (!bestTime || currentTime < bestTime)) {
      setBestTime(currentTime)
      localStorage.setItem(`${gameId}-${difficulty}-best-time`, currentTime.toString())
    }
  }, [gameState, currentTime, bestTime, difficulty, gameId])

  const handleCellClick = (row: number, col: number) => {
    if (sessionState !== "playing" || gameState !== "playing" || board[row][col].state !== "hidden") return

    // First click: generate board with safe zone around clicked cell
    if (isFirstClick) {
      setIsFirstClick(false)
      setStartTime(Date.now())
      const newBoard = createBoard(config.rows, config.cols, config.mines, row, col)
      const revealedBoard = revealCell(newBoard, row, col)
      setBoard(revealedBoard)
      return
    }

    // Start timer on first click
    if (!startTime) {
      setStartTime(Date.now())
    }

    const cell = board[row][col]

    if (cell.value === "mine") {
      // Game over
      setBoard(revealAllMines(board))
      setGameState("lost")
    } else {
      const newBoard = revealCell(board, row, col)
      setBoard(newBoard)

      // Check win
      if (checkWin(newBoard)) {
        setGameState("won")
        saveScore()
      }
    }
  }

  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    if (sessionState !== "playing" || gameState !== "playing") return

    const newBoard = toggleFlag(board, row, col)
    setBoard(newBoard)
  }

  const saveScore = async () => {
    try {
      const settings = gameSettings.get(gameId)
      if (settings.databaseEnabled) {
        const score = Math.max(1000 - currentTime * 10, 100)
        await gameDB.addScore({
          gameId,
          score,
          date: new Date(),
          metadata: {
            difficulty,
            time: currentTime,
          },
        })
      }
    } catch (error) {
      console.error("Error saving score:", error)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCellColor = (value: number): string => {
    const colors = [
      "",
      "text-blue-600",
      "text-green-600",
      "text-red-600",
      "text-purple-600",
      "text-yellow-600",
      "text-pink-600",
      "text-gray-600",
      "text-black",
    ]
    return colors[value] || ""
  }

  const startGame = () => {
    resetGame()
    setSessionState("playing")
  }

  const togglePause = () => {
    setSessionState((prev) => {
      if (prev === "playing") return "paused"
      if (startTime) {
        setStartTime(Date.now() - currentTime * 1000)
      }
      return "playing"
    })
  }

  if (!mounted || board.length === 0) {
    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="p-4">
          <div className="w-full aspect-square max-w-sm sm:max-w-md mx-auto bg-card/50 animate-pulse rounded" />
        </Card>
        <Card className="p-4">
          <div className="h-52 bg-card/50 animate-pulse rounded" />
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <Card className="p-4">
        <div className="relative mx-auto overflow-hidden w-full px-2 sm:px-4" style={{ maxWidth: "28rem" }}>
          {sessionState !== "playing" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/95 backdrop-blur-sm">
              <Button onClick={sessionState === "idle" ? startGame : togglePause}>
                {sessionState === "idle" ? "Start Game" : "Resume Game"}
              </Button>
            </div>
          )}

          <div
            className={cn(
              "grid rounded border border-border",
              difficulty === "easy" ? "gap-0.5 p-0.5" : "gap-0 p-0.5"
            )}
            style={{ gridTemplateColumns: `repeat(${config.cols}, 1fr)` }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
                  disabled={gameState !== "playing"}
                  whileHover={{ scale: difficulty === "easy" ? (cell.state === "hidden" ? 1.05 : 1) : 1 }}
                  whileTap={{ scale: difficulty === "easy" ? 0.95 : 1 }}
                  className={cn(
                    "aspect-square flex items-center justify-center font-bold transition-colors select-none",
                    difficulty === "easy" ? "text-[10px] sm:text-xs" : difficulty === "medium" ? "text-[9px] sm:text-[10px]" : "text-[8px] sm:text-[9px]",
                    cell.state === "hidden"
                      ? "bg-card hover:bg-accent border border-border"
                      : cell.state === "flagged"
                      ? "bg-yellow-500/20 border border-yellow-500"
                      : cell.value === "mine"
                      ? "bg-red-500/20 border border-red-500"
                      : "bg-accent/50 border border-border/50",
                    "disabled:cursor-not-allowed"
                  )}
                >
                  {cell.state === "revealed" && (
                    <span
                      className={cn(
                        cell.value === "mine"
                          ? "text-red-600"
                          : typeof cell.value === "number" && cell.value > 0
                          ? getCellColor(cell.value)
                          : ""
                      )}
                    >
                      {cell.value === "mine" ? "💣" : cell.value > 0 ? cell.value : ""}
                    </span>
                  )}
                  {cell.state === "flagged" && <span>🚩</span>}
                </motion.button>
              ))
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4 lg:sticky lg:top-4">
        <div className="space-y-2 rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Difficulty</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={difficulty === "easy" ? "default" : "outline"}
              onClick={() => setDifficulty("easy")}
              size="sm"
              className="text-xs"
            >
              Easy
            </Button>
            <Button
              variant={difficulty === "medium" ? "default" : "outline"}
              onClick={() => setDifficulty("medium")}
              size="sm"
              className="text-xs"
            >
              Medium
            </Button>
            <Button
              variant={difficulty === "hard" ? "default" : "outline"}
              onClick={() => setDifficulty("hard")}
              size="sm"
              className="text-xs"
            >
              Hard
            </Button>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Game Stats</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-md bg-muted/40 p-2">
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs"><Bomb className="h-3 w-3" />Mines</div>
              <p className="text-lg font-bold">{remainingMines}</p>
            </div>
            <div className="rounded-md bg-muted/40 p-2">
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs"><Clock className="h-3 w-3" />Time</div>
              <p className="text-lg font-bold">{formatTime(currentTime)}</p>
            </div>
            <div className="rounded-md bg-muted/40 p-2">
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs"><Flag className="h-3 w-3" />Flags</div>
              <p className="text-lg font-bold">{flags}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Game Control</p>
          {sessionState === "idle" ? (
            <Button onClick={startGame} className="w-full">Start Game</Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={togglePause} variant="outline" size="sm" className="w-full">
                {sessionState === "playing" ? "Pause" : "Resume"}
              </Button>
              <Button onClick={startGame} variant="outline" size="sm" className="w-full gap-2">
                <RotateCcw className="h-3 w-3" />
                New
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2 rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground">Best Score</p>
          <p className="text-2xl font-bold">{bestTime !== null ? formatTime(bestTime) : "-"}</p>
          <p className="text-xs text-muted-foreground">Best time</p>
        </div>
      </Card>
    </div>
  )
}
