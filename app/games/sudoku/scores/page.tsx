"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Timer } from "lucide-react"

export default function SudokuScoresPage() {
  const [scores, setScores] = useState<{ difficulty: string; time: number }[]>([])

  useEffect(() => {
    // Load best times from localStorage
    const easyTime = localStorage.getItem("sudoku-easy")
    const mediumTime = localStorage.getItem("sudoku-medium")
    const hardTime = localStorage.getItem("sudoku-hard")
    const expertTime = localStorage.getItem("sudoku-expert")

    const allScores = [
      { difficulty: "Easy", time: easyTime ? parseInt(easyTime) : 0 },
      { difficulty: "Medium", time: mediumTime ? parseInt(mediumTime) : 0 },
      { difficulty: "Hard", time: hardTime ? parseInt(hardTime) : 0 },
      { difficulty: "Expert", time: expertTime ? parseInt(expertTime) : 0 },
    ]

    setScores(allScores)
  }, [])

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "--:--"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Best Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scores.map((item, index) => {
              const icons = [
                <Medal key="medal" className="h-5 w-5 text-green-500" />,
                <Medal key="medal2" className="h-5 w-5 text-yellow-500" />,
                <Medal key="medal3" className="h-5 w-5 text-orange-500" />,
                <Medal key="medal4" className="h-5 w-5 text-red-500" />,
              ]

              return (
                <div
                  key={item.difficulty}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {icons[index]}
                    <div>
                      <div className="font-semibold">{item.difficulty}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-mono font-bold text-primary flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      {formatTime(item.time)}
                    </div>
                    {item.time === 0 && (
                      <div className="text-xs text-muted-foreground">Not completed yet</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Complete puzzles on different difficulty levels to set your best times!</p>
          <p className="mt-2">
            Try to minimize your time, hints used, and mistakes to become a Sudoku master.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tips to Improve</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Practice daily to recognize patterns quickly</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Start with easier difficulties and work your way up</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Use notes mode to mark possibilities and avoid mistakes</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Learn advanced techniques like naked pairs and hidden singles</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
