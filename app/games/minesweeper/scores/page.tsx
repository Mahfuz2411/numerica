"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Trophy, Medal, Award, Calendar } from "lucide-react"
import { gameDB, type GameScore } from "@/lib/db/game-db"
import { gameSettings } from "@/lib/db/game-settings"

export default function MinesweeperScoresPage() {
  const [scores, setScores] = useState<GameScore[]>([])
  const [loading, setLoading] = useState(true)
  const [databaseEnabled, setDatabaseEnabled] = useState(true)

  useEffect(() => {
    loadScores()
    const settings = gameSettings.get("minesweeper")
    setDatabaseEnabled(settings.databaseEnabled)
  }, [])

  const loadScores = async () => {
    try {
      const allScores = await gameDB.getScoresByGame("minesweeper", 10)
      setScores(allScores)
    } catch (error) {
      console.error("Error loading scores:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <div className="h-5 w-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{index + 1}</div>
    }
  }

  if (!databaseEnabled) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          Score tracking is disabled. Enable it in Settings to track your high scores.
        </p>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-card/50 animate-pulse rounded" />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Top Scores
        </h2>

        {scores.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No scores yet. Play a game to set your first score!
          </p>
        ) : (
          <div className="space-y-2">
            {scores.map((score, index) => (
              <div
                key={score.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-card/50 hover:bg-accent transition-colors"
              >
                <div className="flex-shrink-0">{getIcon(index)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-lg">{score.score.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {score.metadata?.difficulty || "Unknown"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(score.date)}
                    </div>
                    {score.metadata?.time && (
                      <div>Time: {formatTime(score.metadata.time)}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-2">Scoring System</h3>
        <p className="text-sm text-muted-foreground">
          Your score is calculated based on completion time. Faster times earn higher scores!
          <br />
          Base score: 1000 - (time in seconds × 10)
        </p>
      </Card>
    </div>
  )
}
