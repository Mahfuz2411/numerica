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
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <Card className="p-4">
        <div className="mx-auto w-[min(62vh,28rem)] max-w-full">
          <div className="grid grid-cols-3 gap-2 aspect-square">
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
                    "aspect-square rounded-md border-2 text-2xl md:text-3xl font-bold transition-all",
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
        </div>
      </Card>

      <Card className="p-4 space-y-4 lg:sticky lg:top-24">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={mode === "pvp" ? "default" : "outline"}
            onClick={() => changeMode("pvp")}
            className="gap-1.5 text-xs"
            size="sm"
          >
            <Users className="h-3.5 w-3.5" />
            2P
          </Button>
          <Button
            variant={mode === "ai" ? "default" : "outline"}
            onClick={() => changeMode("ai")}
            className="gap-1.5 text-xs"
            size="sm"
          >
            <Bot className="h-3.5 w-3.5" />
            AI
          </Button>
        </div>

        <div className="rounded-lg border p-3 text-center">
          {winner ? (
            <p className="text-sm font-bold text-primary">Player {winner} Wins! 🎉</p>
          ) : isDraw ? (
            <p className="text-sm font-bold text-muted-foreground">It&apos;s a Draw! 🤝</p>
          ) : isAIThinking ? (
            <p className="text-sm text-muted-foreground">AI is thinking...</p>
          ) : (
            <p className="text-sm font-semibold">
              Current: <span className="text-primary">{currentPlayer}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-md bg-muted/40 p-2">
            <div className="text-xs text-muted-foreground">X</div>
            <div className="font-bold">{scores.X}</div>
          </div>
          <div className="rounded-md bg-muted/40 p-2">
            <div className="text-xs text-muted-foreground">O</div>
            <div className="font-bold">{scores.O}</div>
          </div>
          <div className="rounded-md bg-muted/40 p-2">
            <div className="text-xs text-muted-foreground">Draw</div>
            <div className="font-bold">{scores.draws}</div>
          </div>
        </div>

        <Button onClick={resetGame} variant="outline" className="w-full gap-2">
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
      </Card>
    </div>
  )
}
