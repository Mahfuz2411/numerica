"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Heart, RotateCcw, Clock3 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { gameDB } from "@/lib/db/game-db"
import { gameSettings } from "@/lib/db/game-settings"
import {
  CROSS_SUME_CONFIG,
  type CrossSumeDifficulty,
  createFullActiveGrid,
  generateCrossSumePuzzle,
  getColCurrentSum,
  getRowCurrentSum,
  isPuzzleSolved,
} from "@/lib/games/cross-sum"

interface CrossSumGameProps {
  gameId?: string
}

const MAX_LIVES = 3

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

const getScore = (difficulty: CrossSumeDifficulty, timeSeconds: number, livesLeft: number) => {
  const base = difficulty === "easy" ? 350 : difficulty === "medium" ? 550 : 800
  return Math.max(100, base + livesLeft * 150 - timeSeconds * 3)
}

const getAchievement = (difficulty: CrossSumeDifficulty, timeSeconds: number, livesLeft: number) => {
  if (difficulty === "hard" && timeSeconds <= 70 && livesLeft === 3) return "Cross Sum Master"
  if (timeSeconds <= 90 && livesLeft >= 2) return "Precision Solver"
  if (timeSeconds <= 140) return "Logical Finisher"
  return "Steady Analyst"
}

export function CrossSumGame({ gameId = "cross-sum" }: CrossSumGameProps) {
  const [sessionState, setSessionState] = useState<"idle" | "playing" | "paused">("idle")
  const [difficulty, setDifficulty] = useState<CrossSumeDifficulty>("easy")
  const [puzzle, setPuzzle] = useState(() => generateCrossSumePuzzle("easy"))
  const [activeMask, setActiveMask] = useState(() => createFullActiveGrid(CROSS_SUME_CONFIG.easy.size))
  const [highlightMask, setHighlightMask] = useState(() => createFullActiveGrid(CROSS_SUME_CONFIG.easy.size).map((row) => row.map(() => false)))
  const [lives, setLives] = useState(MAX_LIVES)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing")
  const [message, setMessage] = useState("Remove extra numbers so each row and column sum matches the target.")
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [gamesSolved, setGamesSolved] = useState(0)
  const [latestAchievement, setLatestAchievement] = useState<string | null>(null)
  const [wrongCell, setWrongCell] = useState<{ row: number; col: number } | null>(null)

  const settings = gameSettings.get(gameId)

  useEffect(() => {
    const savedBest = localStorage.getItem(`${gameId}-best-time`)
    if (savedBest) {
      setBestTime(parseInt(savedBest, 10))
    }

    const savedSolved = localStorage.getItem(`${gameId}-games-solved`)
    if (savedSolved) {
      setGamesSolved(parseInt(savedSolved, 10))
    }

    const savedAchievement = localStorage.getItem(`${gameId}-latest-achievement`)
    if (savedAchievement) {
      setLatestAchievement(savedAchievement)
    }
  }, [gameId])

  useEffect(() => {
    const onPause = () => {
      setSessionState((prev) => (prev === "playing" ? "paused" : prev))
    }

    window.addEventListener("numerica:pause-game", onPause)
    return () => window.removeEventListener("numerica:pause-game", onPause)
  }, [])

  useEffect(() => {
    if (status !== "playing" || sessionState !== "playing") {
      return
    }

    const timer = window.setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [status, sessionState])

  const rowStatus = useMemo(
    () =>
      Array.from({ length: puzzle.size }, (_, row) => {
        const current = getRowCurrentSum(puzzle.grid, activeMask, row)
        return {
          current,
          target: puzzle.rowTargets[row],
          complete: current === puzzle.rowTargets[row],
        }
      }),
    [puzzle, activeMask]
  )

  const colStatus = useMemo(
    () =>
      Array.from({ length: puzzle.size }, (_, col) => {
        const current = getColCurrentSum(puzzle.grid, activeMask, col)
        return {
          current,
          target: puzzle.colTargets[col],
          complete: current === puzzle.colTargets[col],
        }
      }),
    [puzzle, activeMask]
  )

  const startNewGame = (nextDifficulty: CrossSumeDifficulty = difficulty) => {
    const nextPuzzle = generateCrossSumePuzzle(nextDifficulty)
    setPuzzle(nextPuzzle)
    setActiveMask(createFullActiveGrid(nextPuzzle.size))
    setHighlightMask(createFullActiveGrid(nextPuzzle.size).map((row) => row.map(() => false)))
    setLives(MAX_LIVES)
    setElapsedTime(0)
    setStatus("playing")
    setWrongCell(null)
    setMessage("Remove extra numbers so each row and column sum matches the target.")
    setSessionState("playing")
  }

  const togglePause = () => {
    setSessionState((prev) => (prev === "playing" ? "paused" : "playing"))
  }

  const handleDifficultyChange = (nextDifficulty: CrossSumeDifficulty) => {
    setDifficulty(nextDifficulty)
    startNewGame(nextDifficulty)
  }

  const handleCellRightClick = (event: React.MouseEvent, row: number, col: number) => {
    event.preventDefault()
    if (sessionState !== "playing" || status !== "playing") return
    if (!activeMask[row][col]) return

    setHighlightMask((prev) => {
      const next = prev.map((line) => [...line])
      next[row][col] = !next[row][col]
      return next
    })
  }

  const handleCellClick = async (row: number, col: number) => {
    if (sessionState !== "playing" || status !== "playing") return
    if (!activeMask[row][col]) return
    if (highlightMask[row][col]) return

    if (puzzle.keepMask[row][col]) {
      setWrongCell({ row, col })
      window.setTimeout(() => setWrongCell(null), 240)

      const nextLives = lives - 1
      setLives(nextLives)

      if (nextLives <= 0) {
        setStatus("lost")
        setMessage("Game over. You clicked protected numbers 3 times.")
      } else {
        setMessage(`Wrong removal. ${nextLives} ${nextLives === 1 ? "chance" : "chances"} left.`)
      }
      return
    }

    setActiveMask((prev) => {
      const next = prev.map((line) => [...line])
      next[row][col] = false
      return next
    })

    setHighlightMask((prev) => {
      const next = prev.map((line) => [...line])
      next[row][col] = false
      return next
    })

    const previewMask = activeMask.map((line) => [...line])
    previewMask[row][col] = false

    if (isPuzzleSolved(puzzle.keepMask, previewMask)) {
      setStatus("won")
      const nextScore = getScore(difficulty, elapsedTime, lives)
      const achievement = getAchievement(difficulty, elapsedTime, lives)
      setLatestAchievement(achievement)
      setMessage(`Solved in ${formatTime(elapsedTime)}. Achievement: ${achievement}`)

      const solved = gamesSolved + 1
      setGamesSolved(solved)
      localStorage.setItem(`${gameId}-games-solved`, String(solved))
      localStorage.setItem(`${gameId}-latest-achievement`, achievement)

      if (!bestTime || elapsedTime < bestTime) {
        setBestTime(elapsedTime)
        localStorage.setItem(`${gameId}-best-time`, String(elapsedTime))
      }

      if (settings.databaseEnabled) {
        await gameDB.addScore({
          gameId,
          score: nextScore,
          date: new Date(),
          metadata: {
            difficulty,
            timeSeconds: elapsedTime,
            livesLeft: lives,
            achievement,
          },
        })
      }
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
      <Card className="p-4">
        <div className="relative mx-auto flex w-full max-w-2xl justify-center overflow-x-auto">
          {sessionState !== "playing" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/95 backdrop-blur-sm">
              <Button onClick={sessionState === "idle" ? () => startNewGame() : togglePause}>
                {sessionState === "idle" ? "Start Game" : "Resume Game"}
              </Button>
            </div>
          )}

          <div className="inline-block rounded-lg border border-border/70 bg-card/40 p-2">
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr)) auto`,
              }}
              onContextMenu={(event) => event.preventDefault()}
            >
              {Array.from({ length: puzzle.size }, (_, row) => (
                <div
                  key={`row-${row}`}
                  className="contents"
                >
                  {Array.from({ length: puzzle.size }, (_, col) => {
                    const active = activeMask[row][col]
                    const isWrong = wrongCell?.row === row && wrongCell?.col === col
                    const isHighlighted = highlightMask[row][col]
                    return (
                      <motion.button
                        key={`${row}-${col}`}
                        whileTap={status === "playing" ? { scale: 0.94 } : {}}
                        onClick={() => handleCellClick(row, col)}
                        onContextMenu={(event) => handleCellRightClick(event, row, col)}
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded border text-base font-semibold transition-colors",
                          active
                            ? "border-border bg-background hover:bg-accent"
                            : "border-border/30 bg-transparent text-transparent",
                          isHighlighted && "border-sky-400 bg-sky-500/15 text-sky-200",
                          isWrong && "border-destructive bg-destructive/20 text-destructive"
                        )}
                        disabled={status !== "playing"}
                      >
                        {active ? puzzle.grid[row][col] : ""}
                      </motion.button>
                    )
                  })}

                  <div
                    className={cn(
                      "ml-1 flex h-11 min-w-11 items-center justify-center rounded border px-2 text-sm font-semibold",
                      rowStatus[row].complete
                        ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                        : "border-border bg-muted/50 text-muted-foreground"
                    )}
                  >
                    {rowStatus[row].target}
                  </div>
                </div>
              ))}

              {Array.from({ length: puzzle.size }, (_, col) => (
                <div
                  key={`col-target-${col}`}
                  className={cn(
                    "mt-1 flex h-11 w-11 items-center justify-center rounded border text-sm font-semibold",
                    colStatus[col].complete
                      ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                      : "border-border bg-muted/50 text-muted-foreground"
                  )}
                >
                  {colStatus[col].target}
                </div>
              ))}
              <div className="mt-1 ml-1 flex h-11 min-w-11 items-center justify-center rounded border border-border bg-muted/50 text-xs text-muted-foreground">
                SUM
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-4 lg:sticky lg:top-4">
        <div className="space-y-2 rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Difficulty</p>
          <Select value={difficulty} onValueChange={(value) => handleDifficultyChange(value as CrossSumeDifficulty)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(CROSS_SUME_CONFIG) as CrossSumeDifficulty[]).map((level) => (
                <SelectItem key={level} value={level}>
                  {CROSS_SUME_CONFIG[level].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Game Stats</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-muted/40 p-2">
              <div className="text-xs text-muted-foreground">Lives</div>
              <div className="mt-1 flex justify-center gap-1">
                {Array.from({ length: MAX_LIVES }, (_, i) => (
                  <Heart
                    key={i}
                    className={cn("h-4 w-4", i < lives ? "fill-red-500 text-red-500" : "text-muted-foreground")}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-muted/40 p-2">
              <div className="text-xs text-muted-foreground">Time</div>
              <div className="text-lg font-bold inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {formatTime(elapsedTime)}
              </div>
            </div>
            <div className="rounded-lg bg-muted/40 p-2">
              <div className="text-xs text-muted-foreground">Solved</div>
              <div className="text-lg font-bold">{gamesSolved}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Game Control</p>
          {sessionState === "idle" ? (
            <Button onClick={() => startNewGame()} className="w-full">Start Game</Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={togglePause} variant="outline" className="w-full">
                {sessionState === "playing" ? "Pause" : "Resume"}
              </Button>
              <Button onClick={() => startNewGame()} variant="outline" className="w-full gap-2">
                <RotateCcw className="h-4 w-4" />
                New
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2 rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground">Best Score</p>
          <p className="text-2xl font-bold">{bestTime !== null ? formatTime(bestTime) : "-"}</p>
        </div>
      </Card>
    </div>
  )
}
