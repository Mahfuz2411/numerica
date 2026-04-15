"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RotateCcw, Trophy, Zap, Gamepad2 } from "lucide-react"
import {
  initializeGame,
  moveTiles,
  getTileColor,
  getTileFontSize,
  type GameState2048,
  type Direction,
  type Tile,
} from "@/lib/games/2048"

interface Game2048Props {
  gameId: string
}

export function Game2048({ gameId }: Game2048Props) {
  const [gameState, setGameState] = useState<GameState2048>(() => initializeGame())
  const [bestScore, setBestScore] = useState(0)
  const [showWinModal, setShowWinModal] = useState(false)
  const [continueAfterWin, setContinueAfterWin] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const gameContainerRef = useRef<HTMLDivElement>(null)

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`${gameId}-best-score`)
    if (saved) {
      const score = parseInt(saved, 10)
      setBestScore(score)
    }
  }, [gameId])

  // Save best score
  useEffect(() => {
    if (gameState.score > bestScore) {
      setBestScore(gameState.score)
      localStorage.setItem(`${gameId}-best-score`, gameState.score.toString())
    }
  }, [gameState.score, bestScore, gameId])

  // Show win modal
  useEffect(() => {
    if (gameState.hasWon && !continueAfterWin && !showWinModal) {
      setShowWinModal(true)
    }
  }, [gameState.hasWon, continueAfterWin, showWinModal])

  // Handle move
  const handleMove = useCallback((direction: Direction) => {
    setGameState(prev => moveTiles(prev, direction))
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showWinModal && !continueAfterWin) return

      const keyMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        W: 'up',
        s: 'down',
        S: 'down',
        a: 'left',
        A: 'left',
        d: 'right',
        D: 'right',
      }

      const direction = keyMap[e.key]
      if (direction) {
        e.preventDefault()
        handleMove(direction)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showWinModal, continueAfterWin, handleMove])

  // Handle touch/swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState.isGameOver || showWinModal) return
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return

    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y
    const minSwipeDistance = 50

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        handleMove(deltaX > 0 ? 'right' : 'left')
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        handleMove(deltaY > 0 ? 'down' : 'up')
      }
    }

    touchStartRef.current = null
  }

  const handleNewGame = () => {
    setGameState(initializeGame())
    setShowWinModal(false)
    setContinueAfterWin(false)
  }

  const handleContinue = () => {
    setShowWinModal(false)
    setContinueAfterWin(true)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
      <Card className="overflow-hidden shadow-lg p-4">
        <div
          ref={gameContainerRef}
          className="relative mx-auto w-full max-w-sm sm:max-w-md px-2 sm:px-0 bg-linear-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-lg aspect-square cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-3 sm:inset-4">
            <div className="absolute inset-0 grid grid-cols-4 gap-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="bg-white/40 dark:bg-slate-700/40 rounded-sm" />
              ))}
            </div>

            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-2">
              <AnimatePresence mode="popLayout">
                {gameState.tiles.map(tile => (
                  <TileComponent key={tile.id} tile={tile} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4 lg:sticky lg:top-24">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">2048</h2>
            <p className="text-xs text-muted-foreground">Merge tiles to reach 2048</p>
          </div>
          <Button
            onClick={handleNewGame}
            size="sm"
            className="gap-2 bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
          >
            <RotateCcw className="h-4 w-4" />
            New
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted/40 p-2">
            <div className="text-xs text-muted-foreground">Score</div>
            <motion.div key={gameState.score} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="text-lg font-bold">{gameState.score}</motion.div>
          </div>
          <div className="rounded-lg bg-muted/40 p-2">
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Trophy className="h-3 w-3" />Best</div>
            <div className="text-lg font-bold">{Math.max(bestScore, gameState.score)}</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-2">
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Zap className="h-3 w-3" />Moves</div>
            <div className="text-lg font-bold">{gameState.moveCount}</div>
          </div>
        </div>

        <div className="rounded-lg border p-3 text-xs text-muted-foreground space-y-2">
          <div className="flex items-center gap-2"><Gamepad2 className="h-4 w-4" />Controls</div>
          <div className="grid grid-cols-1 gap-1">
            <span>Arrow Keys / W A S D</span>
            <span>Swipe on Mobile</span>
          </div>
        </div>

        {gameState.isGameOver && (
          <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 p-3 text-center">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">No more moves available!</p>
          </div>
        )}
      </Card>

      {/* Win Modal */}
      <AnimatePresence>
        {showWinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleNewGame}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-linear-to-b from-background to-muted rounded-xl p-6 max-w-sm w-full shadow-2xl border border-primary/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="text-6xl"
                >
                  🎉
                </motion.div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">You Win!</h2>
                  <p className="text-sm text-muted-foreground">You reached 2048! 🎊</p>
                </div>
                <div className="bg-linear-to-r from-orange-500/10 to-purple-600/10 rounded-lg p-3 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Final Score</p>
                  <p className="text-3xl font-bold bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                    {gameState.score}
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleContinue}
                    variant="outline"
                    className="flex-1"
                  >
                    Keep Playing
                  </Button>
                  <Button
                    onClick={handleNewGame}
                    className="flex-1 bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
                  >
                    New Game
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameState.isGameOver && !showWinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleNewGame}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-linear-to-b from-background to-muted rounded-xl p-6 max-w-sm w-full shadow-2xl border border-destructive/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="text-6xl"
                >
                  😢
                </motion.div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">Game Over!</h2>
                  <p className="text-sm text-muted-foreground">No more moves available.</p>
                </div>
                <div className="bg-linear-to-r from-red-500/10 to-orange-600/10 rounded-lg p-3 border border-destructive/20">
                  <p className="text-xs text-muted-foreground mb-1">Final Score</p>
                  <p className="text-3xl font-bold bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {gameState.score}
                  </p>
                </div>
                {gameState.score > 0 && (
                  <div className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-1">
                    <Trophy className="h-4 w-4" />
                    Nice effort!
                  </div>
                )}
                <Button
                  onClick={handleNewGame}
                  className="w-full bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
                  size="lg"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Individual tile component with animations
 */
function TileComponent({ tile }: { tile: Tile }) {
  return (
    <motion.div
      layout
      layoutId={tile.id}
      initial={tile.isNew ? { scale: 0, opacity: 0 } : { opacity: 0 }}
      animate={{
        scale: tile.mergedFrom ? [1, 1.1, 1] : 1,
        opacity: 1,
      }}
      exit={{ opacity: 0 }}
      transition={{
        layout: { duration: 0.15, ease: 'easeOut' },
        scale: { duration: 0.2 },
      }}
      style={{
        gridColumnStart: tile.x + 1,
        gridRowStart: tile.y + 1,
      }}
      className={`
        ${getTileColor(tile.value)}
        ${getTileFontSize(tile.value)}
        w-full h-full rounded font-bold shadow-md leading-none
        grid place-items-center
      `}
    >
      <span className="leading-none">{tile.value}</span>
    </motion.div>
  )
}
