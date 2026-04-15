"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function GuessTheNumberRulesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How to Play Guess the Number</CardTitle>
        <CardDescription>Crack the hidden 5-digit code in the fewest moves</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Objective</h3>
          <p className="text-sm text-muted-foreground">
            The engine generates a random 5-digit code. Enter your own 5-digit guess and submit it.
            After each move, you will be told how many digits are in the correct position.
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Feedback Example</h3>
          <p className="text-sm text-muted-foreground">
            If the secret code is <strong>50056</strong> and your guess is <strong>00122</strong>,
            the game will return: <strong>1 number in right position</strong>.
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Rules</h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Enter exactly 5 digits per move.</li>
            <li>Digits can repeat in both the secret code and your guesses.</li>
            <li>Use the feedback to improve your next guess.</li>
            <li>The game ends when all 5 positions are correct.</li>
          </ol>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Scoring and Achievements</h3>
          <p className="text-sm text-muted-foreground">
            Fewer moves produce a higher score and better achievements. Try to solve it quickly to top the leaderboard.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
