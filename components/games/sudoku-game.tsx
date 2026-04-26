"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, Lightbulb, Play, Pause, Timer } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  generatePuzzle,
  isPuzzleSolved,
  isValidPlacement,
  findConflicts,
  getHint,
  countEmptyCells,
  type Cell,
  type Difficulty,
  DIFFICULTIES,
} from "@/lib/games/sudoku"

interface SudokuGameProps {
  gameId: string
}

export function SudokuGame({ gameId }: SudokuGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [board, setBoard] = useState<Cell[][]>([])
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [notesMode, setNotesMode] = useState(false)
  const [gameState, setGameState] = useState<"idle" | "playing" | "paused" | "won">("idle")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [highScore, setHighScore] = useState<number | null>(null)

  useEffect(() => {
    const onPause = () => {
      setGameState((prev) => (prev === "playing" ? "paused" : prev))
    }

    window.addEventListener("numerica:pause-game", onPause)
    return () => window.removeEventListener("numerica:pause-game", onPause)
  }, [])

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem(`sudoku-${difficulty}`)
    if (saved) {
      setHighScore(parseInt(saved, 10))
    } else {
      setHighScore(null)
    }
  }, [difficulty])

  // Save high score
  useEffect(() => {
    if (gameState === "won" && elapsedTime > 0) {
      const currentBest = highScore
      if (!currentBest || elapsedTime < currentBest) {
        setHighScore(elapsedTime)
        localStorage.setItem(`sudoku-${difficulty}`, elapsedTime.toString())
      }
    }
  }, [gameState, elapsedTime, difficulty, highScore])

  // Timer
  useEffect(() => {
    if (gameState === "playing" && startTime) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 100)
      return () => clearInterval(interval)
    }
  }, [gameState, startTime])

  const startNewGame = useCallback(() => {
    const newBoard = generatePuzzle(difficulty)
    setBoard(newBoard)
    setSelectedCell(null)
    setNotesMode(false)
    setGameState("playing")
    setStartTime(Date.now())
    setElapsedTime(0)
    setHintsUsed(0)
    setMistakes(0)
  }, [difficulty])

  const togglePause = () => {
    if (gameState === "playing") {
      setGameState("paused")
    } else if (gameState === "paused") {
      // Adjust start time to account for pause duration
      const pausedDuration = elapsedTime * 1000
      setStartTime(Date.now() - pausedDuration)
      setGameState("playing")
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameState !== "playing") return
    if (board[row][col].isFixed) return
    setSelectedCell([row, col])
  }

  const handleNumberInput = (num: number) => {
    if (!selectedCell || gameState !== "playing") return
    const [row, col] = selectedCell

    if (board[row][col].isFixed) return

    const newBoard = board.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          if (notesMode) {
            // Toggle note
            const notes = cell.notes.includes(num)
              ? cell.notes.filter((n) => n !== num)
              : [...cell.notes, num].sort()
            return { ...cell, notes }
          } else {
            // Set value
            const isValid = num === 0 || isValidPlacement(board, row, col, num)
            if (!isValid && num !== 0) {
              setMistakes((prev) => prev + 1)
            }
            return { ...cell, value: num, notes: [], isError: !isValid && num !== 0 }
          }
        }
        return cell
      })
    )

    setBoard(newBoard)

    // Check if puzzle is solved
    if (isPuzzleSolved(newBoard)) {
      setGameState("won")
    }
  }

  const clearCell = () => {
    if (!selectedCell || gameState !== "playing") return
    const [row, col] = selectedCell
    if (board[row][col].isFixed) return

    const newBoard = board.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          return { ...cell, value: 0, notes: [], isError: false }
        }
        return cell
      })
    )
    setBoard(newBoard)
  }

  const useHint = () => {
    if (gameState !== "playing") return
    const hint = getHint(board)
    if (!hint) return

    setHintsUsed((prev) => prev + 1)
    setSelectedCell([hint.row, hint.col])

    const newBoard = board.map((r, i) =>
      r.map((cell, j) => {
        if (i === hint.row && j === hint.col) {
          return { ...cell, value: hint.value, notes: [], isError: false }
        }
        return cell
      })
    )

    setBoard(newBoard)

    if (isPuzzleSolved(newBoard)) {
      setGameState("won")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <Card className="p-3 sm:p-4">
          <div className="relative mx-auto w-full max-w-[19rem] px-1 sm:max-w-[22rem] sm:px-0 md:max-w-[25rem] lg:max-w-[27rem]">
            {(gameState === "paused" || gameState === "idle") && (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="text-center space-y-4">
                  {gameState === "paused" && <p className="text-xl font-semibold">Game Paused</p>}
                  {gameState === "idle" && <p className="text-xl font-semibold">Ready to Play?</p>}
                  <Button onClick={gameState === "paused" ? togglePause : startNewGame}>
                    <Play className="h-4 w-4 mr-2" />
                    {gameState === "paused" ? "Resume" : "Start Game"}
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-9 gap-0 border-4 border-foreground rounded-lg overflow-hidden bg-background aspect-square">
              {board.map((row, i) =>
                row.map((cell, j) => {
                  const isSelected = selectedCell?.[0] === i && selectedCell?.[1] === j
                  const isInSameRow = selectedCell?.[0] === i
                  const isInSameCol = selectedCell?.[1] === j
                  const isInSameBox =
                    selectedCell &&
                    Math.floor(i / 3) === Math.floor(selectedCell[0] / 3) &&
                    Math.floor(j / 3) === Math.floor(selectedCell[1] / 3)
                  const hasRightBorder = (j + 1) % 3 === 0 && j !== 8
                  const hasBottomBorder = (i + 1) % 3 === 0 && i !== 8

                  return (
                    <motion.button
                      key={`${i}-${j}`}
                      onClick={() => handleCellClick(i, j)}
                      whileHover={!cell.isFixed && gameState === "playing" ? { scale: 1.05 } : {}}
                      whileTap={!cell.isFixed && gameState === "playing" ? { scale: 0.95 } : {}}
                      className={cn(
                        "aspect-square flex items-center justify-center text-base sm:text-lg font-semibold transition-colors relative",
                        "border border-border",
                        hasRightBorder && "border-r-2 border-r-foreground",
                        hasBottomBorder && "border-b-2 border-b-foreground",
                        cell.isFixed && "bg-muted/50 text-foreground font-bold",
                        !cell.isFixed && "bg-background",
                        isSelected && "bg-primary/20 ring-2 ring-primary ring-inset",
                        !isSelected && (isInSameRow || isInSameCol || isInSameBox) && "bg-primary/5",
                        cell.isError && "bg-red-500/20 text-red-500",
                        gameState !== "playing" && "cursor-default"
                      )}
                      disabled={gameState !== "playing"}
                    >
                      {cell.value !== 0 ? (
                        <span className={cn(cell.isFixed ? "text-sm sm:text-base" : "text-sm sm:text-base text-primary")}>
                          {cell.value}
                        </span>
                      ) : cell.notes.length > 0 ? (
                        <div className="grid grid-cols-3 gap-0 text-[0.45rem] sm:text-[0.65rem] text-muted-foreground w-full h-full p-0.5">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <div key={num} className="flex items-center justify-center">
                              {cell.notes.includes(num) ? num : ""}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </motion.button>
                  )
                })
              )}
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4 lg:sticky lg:top-4">
          <div className="space-y-2 rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Difficulty</p>
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value as Difficulty)
              }}
              className="w-full px-3 py-1.5 rounded-lg border bg-background text-sm"
              disabled={gameState === "playing" || gameState === "paused"}
            >
              {Object.entries(DIFFICULTIES).map(([key, { name }]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Game Stats</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-blue-500/10 p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><Timer className="h-3 w-3 text-blue-500" />Time</div>
                <div className="font-mono font-bold">{formatTime(elapsedTime)}</div>
              </div>
              <div className="rounded-lg bg-yellow-500/10 p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><Lightbulb className="h-3 w-3 text-yellow-500" />Hints</div>
                <div className="font-bold">{hintsUsed}</div>
              </div>
              <div className="rounded-lg bg-red-500/10 p-2 text-center">
                <div className="text-xs text-muted-foreground">Mistakes</div>
                <div className="font-bold">{mistakes}</div>
              </div>
              <div className="rounded-lg bg-muted/40 p-2 text-center">
                <div className="text-xs text-muted-foreground">State</div>
                <div className="font-bold capitalize">{gameState}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Game Control</p>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={gameState === "idle" ? startNewGame : togglePause} variant="outline" disabled={gameState === "won"}>
                {gameState === "paused" || gameState === "idle" ? <Play className="h-4 w-4 mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
                {gameState === "paused" || gameState === "idle" ? "Start" : "Pause"}
              </Button>
              <Button onClick={startNewGame} variant="outline">
                <RotateCcw className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border p-3 text-center">
            <p className="text-xs text-muted-foreground">Best Score</p>
            <p className="text-2xl font-bold font-mono">{highScore ? formatTime(highScore) : "--:--"}</p>
          </div>
        </Card>
      </div>

      {/* Win Modal */}
          <AnimatePresence>
            {gameState === "won" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={startNewGame}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-background border rounded-lg p-8 max-w-md mx-4"
                >
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🎉</div>
                    <h2 className="text-3xl font-bold">Congratulations!</h2>
                    <div className="space-y-2 text-muted-foreground">
                      <p>Time: {formatTime(elapsedTime)}</p>
                      <p>Hints Used: {hintsUsed}</p>
                      <p>Mistakes: {mistakes}</p>
                      {highScore && elapsedTime < highScore && (
                        <p className="text-yellow-500 font-semibold">🏆 New Best Time!</p>
                      )}
                    </div>
                    <Button onClick={startNewGame} className="w-full">
                      Play Again
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
    </div>
  )
}
