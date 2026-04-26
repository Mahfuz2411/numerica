"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Trophy, Medal, Award, Calendar } from "lucide-react"

export default function WhackAMoleScoresPage() {
  const [scores, setScores] = useState<{difficulty: string, score: number}[]>([])

  useEffect(() => {
    // Load high scores from localStorage
    const easyScore = localStorage.getItem("whack-a-mole-easy")
    const mediumScore = localStorage.getItem("whack-a-mole-medium")
    const hardScore = localStorage.getItem("whack-a-mole-hard")

    const allScores = [
      { difficulty: "Easy", score: easyScore ? parseInt(easyScore) : 0 },
      { difficulty: "Medium", score: mediumScore ? parseInt(mediumScore) : 0 },
      { difficulty: "Hard", score: hardScore ? parseInt(hardScore) : 0 },
    ]

    setScores(allScores)
  }, [])

  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Your High Scores
        </h2>
        <div className="space-y-3">
          {scores.map((item, index) => {
            const icons = [
              <Medal key="medal" className="h-5 w-5 text-yellow-500" />,
              <Medal key="medal2" className="h-5 w-5 text-gray-400" />,
              <Medal key="medal3" className="h-5 w-5 text-amber-600" />,
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
                  <div className="text-2xl font-bold text-primary">
                    {item.score}
                  </div>
                  <div className="text-xs text-muted-foreground">moles</div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Tips to Improve
        </h2>
        <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Practice your peripheral vision to catch moles faster</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Keep your cursor near the center of the board</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Click quickly but accurately - misses waste time!</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>Stay focused and avoid distractions during the game</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
