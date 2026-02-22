"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RotateCcw, Users, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  createEmptyBoard,
  checkWinner,
  checkDraw,
  makeMove,
  getNextPlayer,
  getAIMove,
  type Player,
  type Board,
} from "@/lib/games/tic-tac-toe"
import { gameDB } from "@/lib/db/game-db"
import { gameSettings } from "@/lib/db/game-settings"
import { cn } from "@/lib/utils"

interface TicTacToeGameProps {
  gameId?: string
}

export function TicTacToeGame({ gameId = "tic-tac-toe" }: TicTacToeGameProps) {
  const [board, setBoard] = useState<Board>(createEmptyBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [winner, setWinner] = useState<Player>(null)
  const [isDraw, setIsDraw] = useState(false)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [mode, setMode] = useState<"pvp" | "ai">("pvp")
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })

  const settings = gameSettings.get(gameId)

  const handleCellClick = async (index: number) => {
    if (winner || isDraw || isAIThinking) return

    const newBoard = makeMove(board, index, currentPlayer)
    if (!newBoard) return

    setBoard(newBoard)

    const { winner: gameWinner, winningLine: line } = checkWinner(newBoard)
    const gameDraw = checkDraw(newBoard)

    if (gameWinner) {
      setWinner(gameWinner)
      setWinningLine(line)
      setScores((prev) => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1,
      }))
      
      // Save to database
      if (settings.databaseEnabled) {
        await gameDB.addScore({
          gameId,
          score: gameWinner === "X" ? 1 : 0,
          date: new Date(),
          metadata: { winner: gameWinner, mode },
        })
      }
    } else if (gameDraw) {
      setIsDraw(true)
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }))
    } else {
      const nextPlayer = getNextPlayer(currentPlayer)
      setCurrentPlayer(nextPlayer)

      // AI move
      if (mode === "ai" && nextPlayer === "O") {
        setIsAIThinking(true)
        setTimeout(() => {
          makeAIMove(newBoard)
        }, 500)
      }
    }
  }

  const makeAIMove = async (currentBoard: Board) => {
    const aiMoveIndex = getAIMove(currentBoard, "hard")
    if (aiMoveIndex === -1) {
      setIsAIThinking(false)
      return
    }

    const newBoard = makeMove(currentBoard, aiMoveIndex, "O")
    if (!newBoard) {
      setIsAIThinking(false)
      return
    }

    setBoard(newBoard)
    setIsAIThinking(false)

    const { winner: gameWinner, winningLine: line } = checkWinner(newBoard)
    const gameDraw = checkDraw(newBoard)

    if (gameWinner) {
      setWinner(gameWinner)
      setWinningLine(line)
      setScores((prev) => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1,
      }))

      if (settings.databaseEnabled) {
        await gameDB.addScore({
          gameId,
          score: 0,
          date: new Date(),
          metadata: { winner: gameWinner, mode },
        })
      }
    } else if (gameDraw) {
      setIsDraw(true)
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }))
    } else {
      setCurrentPlayer("X")
    }
  }

  const resetGame = () => {
    setBoard(createEmptyBoard())
    setCurrentPlayer("X")
    setWinner(null)
    setIsDraw(false)
    setWinningLine(null)
    setIsAIThinking(false)
  }

  const changeMode = (newMode: "pvp" | "ai") => {
    setMode(newMode)
    resetGame()
  }

  return (
    <div className="space-y-1.5 sm:space-y-2 md:space-y-3 max-w-2xl mx-auto">
      {/* Mode Selection */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={mode === "pvp" ? "default" : "outline"}
          onClick={() => changeMode("pvp")}
          className="gap-1.5 text-xs sm:text-sm"
          size="sm"
        >
          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
          2 Players
        </Button>
        <Button
          variant={mode === "ai" ? "default" : "outline"}
          onClick={() => changeMode("ai")}
          className="gap-1.5 text-xs sm:text-sm"
          size="sm"
        >
          <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
          vs AI
        </Button>
      </div>

      {/* Game Status */}
      <Card className="p-2">
        <div className="text-center space-y-1.5">
          {winner ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <p className="text-sm sm:text-base md:text-lg font-bold text-primary">
                Player {winner} Wins! 🎉
              </p>
            </motion.div>
          ) : isDraw ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <p className="text-sm sm:text-base md:text-lg font-bold text-muted-foreground">
                It&apos;s a Draw! 🤝
              </p>
            </motion.div>
          ) : (
            <p className="text-xs sm:text-sm md:text-base font-semibold">
              {isAIThinking ? (
                <span className="text-muted-foreground">AI is thinking...</span>
              ) : (
                <>
                  Current Player:{" "}
                  <span className="text-primary">{currentPlayer}</span>
                </>
              )}
            </p>
          )}
          
          <div className="flex justify-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <span>X: {scores.X}</span>
            <span>O: {scores.O}</span>
            <span>Draws: {scores.draws}</span>
          </div>
        </div>
      </Card>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-1 sm:gap-1.5 w-full max-w-[min(70vw,240px)] sm:max-w-[260px] md:max-w-xs mx-auto aspect-square">
        {board.map((cell, index) => {
          const isWinningCell = winningLine?.includes(index)
          return (
            <motion.button
              key={index}
              whileHover={{ scale: cell ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || !!winner || isDraw || isAIThinking}
              className={cn(
                "aspect-square rounded-md border-2 text-xl sm:text-2xl md:text-3xl font-bold transition-all",
                "disabled:cursor-not-allowed",
                cell
                  ? "bg-card border-primary/20"
                  : "bg-card hover:bg-accent hover:border-primary/50",
                isWinningCell && "bg-primary/20 border-primary"
              )}
            >
              {cell && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={cell === "X" ? "text-primary" : "text-secondary-foreground"}
                >
                  {cell}
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Reset Button */}
      <div className="flex justify-center">
        <Button onClick={resetGame} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
      </div>
    </div>
  )
}
