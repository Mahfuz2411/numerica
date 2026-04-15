"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CrossSumRulesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How to Play Cross Sum</CardTitle>
        <CardDescription>Remove only extra numbers and match all row/column sums</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Objective</h3>
          <p className="text-sm text-muted-foreground">
            Each puzzle starts with a full number grid. Your task is to remove extra numbers so that every row and every
            column reaches the target sum shown on the right and bottom.
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Difficulty Sizes</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Easy: 5×5 grid</li>
            <li>Medium: 6×6 grid</li>
            <li>Hard: 7×7 grid</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Lives</h3>
          <p className="text-sm text-muted-foreground">
            You have 3 chances. If you click a number that should not be removed, you lose one chance.
            Losing all 3 chances ends the game.
          </p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Controls</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Left click: remove a number</li>
            <li>Right click: highlight a number you want to keep</li>
            <li>Rows/columns auto-mark as complete when sums match</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Completion State</h3>
          <p className="text-sm text-muted-foreground">
            A row or column is marked complete automatically when its active numbers match the expected sum.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
