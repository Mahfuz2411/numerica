"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { RotateCcw, Target, ListChecks, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { gameDB } from "@/lib/db/game-db"
import { gameSettings } from "@/lib/db/game-settings"

type GuessResult = {
  guess: string
  rightPositions: number
}

interface GuessTheNumberGameProps {
  gameId?: string
}

const CODE_LENGTH = 5

const getRandomCode = () => {
  const random = Math.floor(Math.random() * 100000)
  return String(random).padStart(CODE_LENGTH, "0")
}

const getRightPositions = (secret: string, guess: string) => {
  let count = 0
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (secret[i] === guess[i]) count += 1
  }
  return count
}

const getAchievement = (moves: number) => {
  if (moves <= 3) return "Mind Reader"
  if (moves <= 5) return "Sharp Solver"
  if (moves <= 8) return "Pattern Hunter"
  if (moves <= 12) return "Persistent Analyst"
  return "Never Give Up"
}

export function GuessTheNumberGame({ gameId = "guess-the-number" }: GuessTheNumberGameProps) {
  const [sessionState, setSessionState] = useState<"idle" | "playing" | "paused">("idle")
  const [secretCode, setSecretCode] = useState("")
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""))
  const [history, setHistory] = useState<GuessResult[]>([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [feedback, setFeedback] = useState("Enter five digits and submit your guess.")
  const [bestMoves, setBestMoves] = useState<number | null>(null)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [achievement, setAchievement] = useState<string | null>(null)

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const settings = gameSettings.get(gameId)

  useEffect(() => {
    const savedBest = localStorage.getItem(`${gameId}-best-moves`)
    if (savedBest) {
      setBestMoves(parseInt(savedBest, 10))
    }

    const savedGamesPlayed = localStorage.getItem(`${gameId}-games-played`)
    if (savedGamesPlayed) {
      setGamesPlayed(parseInt(savedGamesPlayed, 10))
    }
  }, [gameId])

  useEffect(() => {
    const onPause = () => {
      setSessionState((prev) => (prev === "playing" ? "paused" : prev))
    }

    window.addEventListener("numerica:pause-game", onPause)
    return () => window.removeEventListener("numerica:pause-game", onPause)
  }, [])

  const canSubmit = useMemo(() => digits.every((digit) => /^\d$/.test(digit)), [digits])

  const handleDigitChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, "")
    const nextDigit = numericValue.slice(-1)

    setDigits((prev) => {
      const next = [...prev]
      next[index] = nextDigit
      return next
    })

    if (nextDigit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleDigitKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmitGuess = async () => {
    if (sessionState !== "playing" || !canSubmit || won) {
      return
    }

    const guess = digits.join("")
    const rightPositions = getRightPositions(secretCode, guess)
    const nextMoves = moves + 1

    setMoves(nextMoves)
    setHistory((prev) => [{ guess, rightPositions }, ...prev].slice(0, 5))

    if (rightPositions === CODE_LENGTH) {
      setWon(true)
      const earnedAchievement = getAchievement(nextMoves)
      setAchievement(earnedAchievement)
      setFeedback(`Correct! You solved it in ${nextMoves} ${nextMoves === 1 ? "move" : "moves"}.`)

      const nextGamesPlayed = gamesPlayed + 1
      setGamesPlayed(nextGamesPlayed)
      localStorage.setItem(`${gameId}-games-played`, String(nextGamesPlayed))
      localStorage.setItem(`${gameId}-last-achievement`, earnedAchievement)

      if (!bestMoves || nextMoves < bestMoves) {
        setBestMoves(nextMoves)
        localStorage.setItem(`${gameId}-best-moves`, String(nextMoves))
      }

      if (settings.databaseEnabled) {
        const score = Math.max(1, 250 - nextMoves * 20)
        await gameDB.addScore({
          gameId,
          score,
          date: new Date(),
          metadata: {
            attempts: nextMoves,
            achievement: earnedAchievement,
          },
        })
      }
    } else {
      setFeedback(`${rightPositions} ${rightPositions === 1 ? "number is" : "numbers are"} in the right position.`)
      setDigits(Array(CODE_LENGTH).fill(""))
      inputRefs.current[0]?.focus()
    }
  }

  const startNewGame = () => {
    setSecretCode(getRandomCode())
    setDigits(Array(CODE_LENGTH).fill(""))
    setHistory([])
    setMoves(0)
    setWon(false)
    setFeedback("Enter five digits and submit your guess.")
    setAchievement(null)
    inputRefs.current[0]?.focus()
    setSessionState("playing")
  }

  const togglePause = () => {
    setSessionState((prev) => (prev === "playing" ? "paused" : "playing"))
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <Card className="p-4">
        <div className="relative mx-auto w-full max-w-md space-y-4">
          {sessionState !== "playing" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/95 backdrop-blur-sm">
              <Button onClick={sessionState === "idle" ? startNewGame : togglePause}>
                {sessionState === "idle" ? "Start Game" : "Resume Game"}
              </Button>
            </div>
          )}

          <div className="rounded-lg border bg-card/50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Guess Code</p>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  value={digit}
                  inputMode="numeric"
                  maxLength={1}
                  onChange={(event) => handleDigitChange(index, event.target.value)}
                  onKeyDown={(event) => handleDigitKeyDown(index, event)}
                  disabled={won || sessionState !== "playing"}
                  className="h-12 w-full rounded-lg border border-input bg-transparent text-center text-lg font-semibold outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
                />
              ))}
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Button onClick={handleSubmitGuess} disabled={sessionState !== "playing" || !canSubmit || won} className="flex-1 gap-2">
                <Target className="h-4 w-4" />
                Submit Guess
              </Button>
              <Button variant="outline" onClick={startNewGame} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <p className="text-sm text-muted-foreground">{feedback}</p>
            {won && achievement && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Achievement: {achievement}
              </motion.div>
            )}
          </div>

          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <ListChecks className="h-4 w-4" />
              Last 5 Guesses
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No guesses yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map((entry, index) => (
                  <div key={`${entry.guess}-${index}`} className="flex items-center justify-between rounded-md bg-accent px-3 py-2 text-sm">
                    <span className="font-mono tracking-[0.2em]">{entry.guess}</span>
                    <span className="text-muted-foreground">
                      {entry.rightPositions} right position{entry.rightPositions === 1 ? "" : "s"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-4 lg:sticky lg:top-4">
        <div className="space-y-2 rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Game Stats</p>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Moves</p>
              <p className="text-2xl font-bold">{moves}</p>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Games Solved</p>
              <p className="text-2xl font-bold">{gamesPlayed}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Game Control</p>
          {sessionState === "idle" ? (
            <Button onClick={startNewGame} className="w-full">Start Game</Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={togglePause} variant="outline" className="w-full">
                {sessionState === "playing" ? "Pause" : "Resume"}
              </Button>
              <Button variant="outline" onClick={startNewGame} className="w-full gap-2">
                <RotateCcw className="h-4 w-4" />
                New
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2 rounded-lg border p-3 text-center">
          <p className="text-xs text-muted-foreground">Best Score</p>
          <p className="text-2xl font-bold">{bestMoves ?? "-"}</p>
          <p className="text-xs text-muted-foreground">Fewest moves</p>
        </div>
      </Card>
    </div>
  )
}
