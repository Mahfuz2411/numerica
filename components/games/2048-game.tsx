"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, Trophy, Zap } from "lucide-react"
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

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`${gameId}-best-score`)
    if (saved) {
      const score = parseInt(saved, 10)
      setBestScore(score)
      setGameState(prev => ({ ...prev, bestScore: score }))
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
    if (gameState.hasWon && !continueAfterWin) {
      setShowWinModal(true)
    }
  }, [gameState.hasWon, continueAfterWin])

  // Handle move
  const handleMove = useCallback((direction: Direction) => {
    setGameState(prev => {
      const newState = moveTiles(prev, direction)
      return newState
    })
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showWinModal || gameState.isGameOver) return

      const keyMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      }

      const direction = keyMap[e.key]
      if (direction) {
        e.preventDefault()
        handleMove(direction)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, showWinModal, handleMove])

  // Handle touch/swipe
  const handleTouchStart = (e: React.TouchEvent) => {
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
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        handleMove(deltaX > 0 ? 'right' : 'left')
      }
    } else {
      // Vertical swipe
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
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* Header with scores */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-2 sm:gap-4">
          <Card className="px-3 py-2 sm:px-4 sm:py-3">
            <div className="text-xs sm:text-sm text-muted-foreground">Score</div>
            <motion.div
              key={gameState.score}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-xl sm:text-2xl font-bold text-primary"
            >
              {gameState.score}
            </motion.div>
          </Card>
          
          <Card className="px-3 py-2 sm:px-4 sm:py-3">
            <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
              Best
            </div>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
              {Math.max(bestScore, gameState.score)}
            </div>
          </Card>
        </div>

        <Button onClick={handleNewGame} size="lg" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">New Game</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Instructions */}
      <Card className="bg-muted/50">
        <CardContent className="p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-center text-muted-foreground">
            <kbd className="px-2 py-1 bg-background rounded border text-xs">↑ ↓ ← →</kbd>
            {" "}or{" "}
            <kbd className="px-2 py-1 bg-background rounded border text-xs">W A S D</kbd>
            {" "}or{" "}
            <span className="font-semibold">Swipe</span>
            {" "}to move tiles. Merge tiles to reach{" "}
            <span className="font-bold text-primary">2048!</span>
          </p>
        </CardContent>
      </Card>

      {/* Game Board */}
      <Card>
        <CardContent className="p-2 sm:p-4">
          <div
            className="relative bg-amber-100 dark:bg-amber-900/20 rounded-lg p-2 sm:p-3 aspect-square"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Grid background */}
            <div className="absolute inset-2 sm:inset-3 grid grid-cols-4 gap-2 sm:gap-3">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-amber-200/50 dark:bg-amber-800/20 rounded"
                />
              ))}
            </div>

            {/* Tiles */}
            <div className="relative w-full h-full">
              <AnimatePresence>
                {gameState.tiles.map((tile) => (
                  <TileComponent key={tile.id} tile={tile} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="flex justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Zap className="h-4 w-4" />
          Moves: {gameState.moveCount}
        </div>
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {showWinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowWinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-background rounded-lg p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold">You Win!</h2>
                <p className="text-muted-foreground">
                  Congratulations! You reached 2048!
                </p>
                <div className="text-3xl font-bold text-primary">
                  Score: {gameState.score}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleContinue} variant="outline" className="flex-1">
                    Keep Playing
                  </Button>
                  <Button onClick={handleNewGame} className="flex-1">
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
        {gameState.isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleNewGame}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-background rounded-lg p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">😢</div>
                <h2 className="text-2xl font-bold">Game Over!</h2>
                <p className="text-muted-foreground">
                  No more moves available.
                </p>
                <div className="text-3xl font-bold text-primary">
                  Score: {gameState.score}
                </div>
                {gameState.score === bestScore && (
                  <div className="text-sm font-semibold text-yellow-600 flex items-center justify-center gap-1">
                    <Trophy className="h-4 w-4" />
                    New Best Score!
                  </div>
                )}
                <Button onClick={handleNewGame} className="w-full" size="lg">
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

function TileComponent({ tile }: { tile: Tile }) {
  const tileSize = 'calc((100% - 1.5rem) / 4)' // 4 tiles with 3 gaps (0.5rem each)
  
  return (
    <motion.div
      layoutId={tile.id}
      initial={tile.isNew ? { scale: 0, opacity: 0 } : false}
      animate={{
        scale: tile.isMerged ? [1, 1.1, 1] : 1,
        opacity: 1,
        x: `calc(${tile.col * 100}% + ${tile.col * 0.5}rem)`,
        y: `calc(${tile.row * 100}% + ${tile.row * 0.5}rem)`,
      }}
      transition={{
        layout: { duration: 0.15 },
        scale: { duration: 0.2 },
      }}
      style={{
        position: 'absolute',
        width: tileSize,
        height: tileSize,
      }}
      className={`
        ${getTileColor(tile.value)}
        ${getTileFontSize(tile.value)}
        rounded flex items-center justify-center
        font-bold shadow-lg
      `}
    >
      {tile.value}
    </motion.div>
  )
}
