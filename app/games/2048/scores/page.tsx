"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, TrendingUp, Zap, Target } from "lucide-react"

const GAME_ID = "2048"

export default function Scores2048Page() {
  const [bestScore, setBestScore] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [totalScore, setTotalScore] = useState(0)

  useEffect(() => {
    // Load stats from localStorage
    const savedBest = localStorage.getItem(`${GAME_ID}-best-score`)
    const savedGames = localStorage.getItem(`${GAME_ID}-games-played`)
    const savedTotal = localStorage.getItem(`${GAME_ID}-total-score`)

    if (savedBest) setBestScore(parseInt(savedBest, 10))
    if (savedGames) setGamesPlayed(parseInt(savedGames, 10))
    if (savedTotal) setTotalScore(parseInt(savedTotal, 10))
  }, [])

  const averageScore = gamesPlayed > 0 ? Math.round(totalScore / gamesPlayed) : 0

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Your Scores</h1>
        <p className="text-muted-foreground">
          Track your progress and achievements
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{bestScore}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Your highest score ever
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Games Played</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{gamesPlayed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total games completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{averageScore}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mean score per game
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Score</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalScore}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Combined score across all games
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score Milestones</CardTitle>
          <CardDescription>
            Achievements to unlock based on your best score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { score: 512, title: "Getting Started", emoji: "🌟", color: "text-blue-600" },
              { score: 1024, title: "Half Way There", emoji: "⭐", color: "text-purple-600" },
              { score: 2048, title: "Winner!", emoji: "🏆", color: "text-yellow-600" },
              { score: 4096, title: "Double Winner", emoji: "💎", color: "text-cyan-600" },
              { score: 8192, title: "Master", emoji: "👑", color: "text-orange-600" },
              { score: 16384, title: "Legend", emoji: "🌟", color: "text-pink-600" },
            ].map((milestone) => {
              const achieved = bestScore >= milestone.score
              return (
                <div
                  key={milestone.score}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    achieved
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/50 border-muted opacity-50"
                  }`}
                >
                  <div className="text-3xl">{milestone.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{milestone.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Reach {milestone.score.toLocaleString()}
                    </div>
                  </div>
                  {achieved && (
                    <div className={`text-sm font-bold ${milestone.color}`}>
                      ✓ Achieved
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-center text-muted-foreground">
            Keep playing to improve your scores and unlock all achievements!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
