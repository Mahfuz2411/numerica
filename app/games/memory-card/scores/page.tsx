"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { gameDB, type GameScore } from "@/lib/db/game-db"

const GAME_ID = "memory-card"

export default function MemoryCardScoresPage() {
  const [scores, setScores] = useState<GameScore[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadScores()
  }, [])

  const loadScores = async () => {
    try {
      setIsLoading(true)
      const gameScores = await gameDB.getScoresByGame(GAME_ID, 10)
      setScores(gameScores)
    } catch (error) {
      console.error("Error loading scores:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearScores = async () => {
    if (confirm("Are you sure you want to clear all scores for this game?")) {
      try {
        await gameDB.clearScores(GAME_ID)
        setScores([])
      } catch (error) {
        console.error("Error clearing scores:", error)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>High Scores</CardTitle>
            <CardDescription>Your best performances</CardDescription>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearScores}
            disabled={scores.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading scores...</p>
        ) : scores.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No scores yet. Play a game to track your performance!
          </p>
        ) : (
          <div className="space-y-2">
            {scores.map((score, index) => {
              const moves = score.metadata?.moves || 0
              const time = score.metadata?.time || 0
              const mins = Math.floor(time / 60)
              const secs = time % 60

              return (
                <motion.div
                  key={score.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-semibold">Score: {score.score}</p>
                      <p className="text-xs text-muted-foreground">
                        {moves} moves • {mins}:{secs.toString().padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date(score.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(score.date).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
