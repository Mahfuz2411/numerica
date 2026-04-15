"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { gameDB, type GameScore } from "@/lib/db/game-db"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

const GAME_ID = "cross-sum"

export default function CrossSumScoresPage() {
  const [scores, setScores] = useState<GameScore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

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
    try {
      setIsClearing(true)
      await gameDB.clearScores(GAME_ID)
      setScores([])
      toast.success("All scores cleared!")
    } catch (error) {
      console.error("Error clearing scores:", error)
      toast.error("Failed to clear scores")
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>High Scores</CardTitle>
            <CardDescription>Top Cross Sum runs by time, lives, and difficulty</CardDescription>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            disabled={scores.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="py-8 text-center text-muted-foreground">Loading scores...</p>
        ) : scores.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No scores yet. Solve a puzzle to appear here.</p>
        ) : (
          <div className="space-y-2">
            {scores.map((score, index) => (
              <motion.div
                key={score.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between rounded-lg bg-accent p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                  <div>
                    <p className="font-semibold">Score: {score.score}</p>
                    <p className="text-xs text-muted-foreground">
                      {String(score.metadata?.difficulty ?? "-").toUpperCase()} • Time {score.metadata?.timeSeconds ?? "-"}s • Lives left {score.metadata?.livesLeft ?? "-"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{new Date(score.date).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">{new Date(score.date).toLocaleTimeString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all scores?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all saved scores for this game.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isClearing}
              onClick={async () => {
                setConfirmOpen(false)
                await handleClearScores()
              }}
            >
              {isClearing ? "Clearing..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
