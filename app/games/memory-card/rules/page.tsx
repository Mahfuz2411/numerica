"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MemoryCardRulesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How to Play Memory Card Game</CardTitle>
        <CardDescription>Test your memory and concentration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Objective</h3>
          <p className="text-sm text-muted-foreground">
            Find and match all pairs of cards in the fewest moves and shortest time possible.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
            <li>Click on any card to flip it over and reveal the emoji</li>
            <li>Click on another card to try to find its matching pair</li>
            <li>If the cards match, they stay flipped and are highlighted</li>
            <li>If they don&apos;t match, they flip back after a short delay</li>
            <li>Continue until all pairs are found</li>
            <li>Try to complete the game in as few moves as possible!</li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Scoring</h3>
          <p className="text-sm text-muted-foreground">
            Your score is calculated based on:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
            <li>Number of moves (fewer is better)</li>
            <li>Time taken (faster is better)</li>
            <li>Perfect game: Minimum 16 moves (flipping each card once to find matches)</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Strategy Tips</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Try to remember the positions of cards you&apos;ve seen</li>
            <li>Start by flipping cards in a systematic pattern</li>
            <li>Focus on one section at a time</li>
            <li>Pay attention to both the emoji and its position</li>
            <li>Practice makes perfect - your memory will improve!</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
