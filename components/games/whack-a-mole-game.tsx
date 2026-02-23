"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hammer, RotateCcw, Trophy, Timer } from "lucide-react"

type Difficulty = "easy" | "medium" | "hard"

interface DifficultyConfig {
  duration: number // game duration in seconds
  moleShowTime: number // how long mole stays visible (ms)
  moleHideTime: number // time between moles appearing (ms)
  minInterval: number // minimum time between spawns
  maxInterval: number // maximum time between spawns
}

const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: {
    duration: 30,
    moleShowTime: 1500,
    moleHideTime: 800,
    minInterval: 800,
    maxInterval: 1200,
  },
  medium: {
    duration: 45,
    moleShowTime: 1000,
    moleHideTime: 600,
    minInterval: 600,
    maxInterval: 900,
  },
  hard: {
    duration: 60,
    moleShowTime: 700,
    moleHideTime: 400,
    minInterval: 400,
    maxInterval: 700,
  },
}

interface WhackAMoleGameProps {
  gameId: string
}

export function WhackAMoleGame({ gameId }: WhackAMoleGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DIFFICULTIES.easy.duration)
  const [activeMoles, setActiveMoles] = useState<Set<number>>(new Set())
  const [whackedMole, setWhackedMole] = useState<number | null>(null)
  const [highScore, setHighScore] = useState(0)
  
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null)
  const moleTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map())

  const config = DIFFICULTIES[difficulty]

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`whack-a-mole-${difficulty}`)
    if (saved) {
      setHighScore(parseInt(saved, 10))
    }
  }, [difficulty])

  // Save high score
  useEffect(() => {
    if (gameState === "finished" && score > highScore) {
      setHighScore(score)
      localStorage.setItem(`whack-a-mole-${difficulty}`, score.toString())
    }
  }, [gameState, score, highScore, difficulty])

  const spawnMole = useCallback(() => {
    if (gameState !== "playing") return

    const availableHoles = Array.from({ length: 9 }, (_, i) => i).filter(
      (i) => !activeMoles.has(i)
    )

    if (availableHoles.length === 0) return

    const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)]
    
    setActiveMoles((prev) => new Set([...Array.from(prev), randomHole]))

    const timer = setTimeout(() => {
      setActiveMoles((prev) => {
        const next = new Set(prev)
        next.delete(randomHole)
        return next
      })
      moleTimersRef.current.delete(randomHole)
    }, config.moleShowTime)

    moleTimersRef.current.set(randomHole, timer)

    // Schedule next mole spawn
    const nextSpawnDelay = 
      config.minInterval + Math.random() * (config.maxInterval - config.minInterval)
    
    setTimeout(() => {
      if (gameState === "playing") {
        spawnMole()
      }
    }, nextSpawnDelay)
  }, [gameState, activeMoles, config])

  const startGame = useCallback(() => {
    setGameState("playing")
    setScore(0)
    setTimeLeft(config.duration)
    setActiveMoles(new Set())
    setWhackedMole(null)

    // Clear any existing timers
    if (gameTimerRef.current) clearInterval(gameTimerRef.current)
    moleTimersRef.current.forEach((timer) => clearTimeout(timer))
    moleTimersRef.current.clear()

    // Start game timer
    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("finished")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Start spawning moles
    spawnMole()
  }, [config, spawnMole])

  const whackMole = (index: number) => {
    if (gameState !== "playing" || !activeMoles.has(index)) return

    // Remove mole immediately
    setActiveMoles((prev) => {
      const next = new Set(prev)
      next.delete(index)
      return next
    })

    // Clear the mole's hide timer
    const timer = moleTimersRef.current.get(index)
    if (timer) {
      clearTimeout(timer)
      moleTimersRef.current.delete(index)
    }

    // Update score and show whack animation
    setScore((prev) => prev + 1)
    setWhackedMole(index)
    setTimeout(() => setWhackedMole(null), 300)
  }

  const resetGame = useCallback(() => {
    setGameState("idle")
    setScore(0)
    setTimeLeft(config.duration)
    setActiveMoles(new Set())
    setWhackedMole(null)

    if (gameTimerRef.current) clearInterval(gameTimerRef.current)
    moleTimersRef.current.forEach((timer) => clearTimeout(timer))
    moleTimersRef.current.clear()
  }, [config])

  // Cleanup on unmount
  useEffect(() => {
    const moleTimers = moleTimersRef.current
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current)
      moleTimers.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  // Reset when difficulty changes
  useEffect(() => {
    resetGame()
  }, [difficulty, resetGame])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Hammer className="h-6 w-6" />
              Whack-a-Mole
            </span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="px-4 py-2 rounded-lg border bg-background text-sm"
              disabled={gameState === "playing"}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="flex gap-4 justify-center flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
              <div className="text-center">
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10">
              <Timer className="h-5 w-5 text-blue-500" />
              <div className="text-center">
                <div className="text-2xl font-bold">{timeLeft}s</div>
                <div className="text-xs text-muted-foreground">Time Left</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div className="text-center">
                <div className="text-2xl font-bold">{highScore}</div>
                <div className="text-xs text-muted-foreground">Best</div>
              </div>
            </div>
          </div>

          {/* Game Board */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {Array.from({ length: 9 }, (_, i) => (
                <motion.button
                  key={i}
                  onClick={() => whackMole(i)}
                  className="relative aspect-square rounded-2xl bg-gradient-to-b from-amber-900 to-amber-950 border-4 border-amber-800 overflow-hidden cursor-pointer disabled:cursor-not-allowed"
                  disabled={gameState !== "playing"}
                  whileHover={gameState === "playing" ? { scale: 1.05 } : {}}
                  whileTap={gameState === "playing" ? { scale: 0.95 } : {}}
                >
                  {/* Hole */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-2/3 bg-black/60 rounded-full" />
                  </div>

                  {/* Mole */}
                  <AnimatePresence>
                    {activeMoles.has(i) && (
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: whackedMole === i ? "100%" : "10%" }}
                        exit={{ y: "100%" }}
                        transition={{ 
                          type: "spring", 
                          damping: 15,
                          stiffness: 300
                        }}
                        className="absolute inset-0 flex items-end justify-center pb-2"
                      >
                        <div className="text-6xl">🦫</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Whack effect */}
                  <AnimatePresence>
                    {whackedMole === i && (
                      <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="text-4xl">💥</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            {/* Game Over Overlay */}
            <AnimatePresence>
              {gameState === "finished" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl"
                >
                  <Card className="text-center p-6">
                    <CardTitle className="text-2xl mb-4">Game Over!</CardTitle>
                    <div className="space-y-2">
                      <p className="text-4xl font-bold text-primary">{score}</p>
                      <p className="text-muted-foreground">Moles Whacked</p>
                      {score > highScore && (
                        <p className="text-yellow-500 font-semibold">🎉 New High Score!</p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            {gameState === "idle" && (
              <Button onClick={startGame} size="lg" className="gap-2">
                <Hammer className="h-5 w-5" />
                Start Game
              </Button>
            )}
            {gameState === "finished" && (
              <Button onClick={resetGame} size="lg" className="gap-2">
                <RotateCcw className="h-5 w-5" />
                Play Again
              </Button>
            )}
          </div>

          {/* Instructions */}
          {gameState === "idle" && (
            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>Click on moles as they pop up to whack them!</p>
              <p>The faster you click, the higher your score!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
