"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TicTacToeRulesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How to Play Tic-Tac-Toe</CardTitle>
        <CardDescription>Learn the rules and strategy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Objective</h3>
          <p className="text-sm text-muted-foreground">
            Be the first player to get three of your marks (X or O) in a row - horizontally,
            vertically, or diagonally.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Game Modes</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>
              <strong>2 Players:</strong> Take turns with a friend on the same device
            </li>
            <li>
              <strong>vs AI:</strong> Challenge the computer AI (you are X, AI is O)
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
            <li>Player X always goes first</li>
            <li>Click on an empty cell to place your mark</li>
            <li>Players alternate turns</li>
            <li>The first player to get 3 marks in a row wins</li>
            <li>If all 9 cells are filled without a winner, the game is a draw</li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Strategy Tips</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Control the center cell - it&apos;s part of 4 winning lines</li>
            <li>Block your opponent from getting three in a row</li>
            <li>Create multiple winning threats (a &quot;fork&quot;)</li>
            <li>Corner cells are stronger than edge cells</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
