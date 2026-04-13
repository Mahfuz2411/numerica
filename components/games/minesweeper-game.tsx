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
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [board, setBoard] = useState<Cell[][]>([])
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
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
    if (gameState === "playing" && startTime) {
      const interval = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [gameState, startTime])

  const handleCellClick = (row: number, col: number) => {
    if (gameState !== "playing" || board[row][col].state !== "hidden") return

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
    if (gameState !== "playing") return

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

  if (!mounted || board.length === 0) {
    return (
      <div className="space-y-1.5 sm:space-y-2 max-w-2xl mx-auto">
        <Card className="p-2">
          <div className="h-12 bg-card/50 animate-pulse rounded" />
        </Card>
        <div className="w-full aspect-square max-w-xs mx-auto bg-card/50 animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="space-y-1.5 sm:space-y-2 max-w-2xl mx-auto">
      {/* Difficulty & Stats */}
      <Card className="p-2">
        <div className="space-y-2">
          {/* Difficulty Selection */}
          <div className="flex gap-1.5 justify-center">
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

          {/* Stats */}
          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Bomb className="h-3 w-3" />
                <span className="text-xs">Mines</span>
              </div>
              <p className="text-sm font-bold">{remainingMines}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="text-xs">Time</span>
              </div>
              <p className="text-sm font-bold">{formatTime(currentTime)}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Flag className="h-3 w-3" />
                <span className="text-xs">Flags</span>
              </div>
              <p className="text-sm font-bold">{flags}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Game Status */}
      {gameState !== "playing" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-3 bg-primary/10 border-primary">
            <div className="text-center space-y-1">
              <p className="text-lg font-bold text-primary">
                {gameState === "won" ? "🎉 You Won!" : "💥 Game Over!"}
              </p>
              <p className="text-xs text-muted-foreground">
                Time: {formatTime(currentTime)}
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Game Board */}
      <div
        className="mx-auto overflow-hidden"
        style={{
          maxWidth: difficulty === "easy" ? "220px" : difficulty === "medium" ? "280px" : "360px",
        }}
      >
        <div
          className={cn(
            "grid rounded border border-border",
            difficulty === "easy" 
              ? "gap-0.5 p-0.5" 
              : "gap-0 p-0.5"
          )}
          style={{
            gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
          }}
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

      {/* Reset Button */}
      <div className="flex justify-center">
        <Button onClick={resetGame} variant="outline" size="sm" className="gap-2">
          <RotateCcw className="h-3 w-3" />
          New Game
        </Button>
      </div>

      {/* Instructions */}
      <Card className="p-2">
        <p className="text-xs text-center text-muted-foreground">
          Left click to reveal | Right click to flag
        </p>
      </Card>
    </div>
  )
}
