"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings2, Info } from "lucide-react"

export default function SudokuSettingsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Game Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Difficulty</h3>
            <p className="text-sm text-muted-foreground">
              Change the difficulty level from the main game screen. Each difficulty offers different challenges:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground ml-4">
              <li>• <strong>Easy:</strong> 30 empty cells, great for learning</li>
              <li>• <strong>Medium:</strong> 40 empty cells, moderate challenge</li>
              <li>• <strong>Hard:</strong> 50 empty cells, requires advanced techniques</li>
              <li>• <strong>Expert:</strong> 55 empty cells, for masters only!</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Controls</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Click a cell to select it</li>
              <li>• Click a number (1-9) to fill the cell</li>
              <li>• Use the pencil button to toggle notes mode</li>
              <li>• Use Clear button to erase a cell</li>
              <li>• Use Hint button when stuck</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Timer:</strong> Tracks your solving time</li>
              <li>• <strong>Notes Mode:</strong> Mark possible numbers in cells</li>
              <li>• <strong>Error Detection:</strong> Invalid entries are highlighted in red</li>
              <li>• <strong>Hints:</strong> Get help when you&apos;re stuck</li>
              <li>• <strong>Pause/Resume:</strong> Take breaks without losing progress</li>
              <li>• <strong>Best Times:</strong> Your fastest completion times are saved</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About Sudoku
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Sudoku is a logic-based number puzzle that originated in Japan. The objective is to fill a 9×9 grid 
            with digits so that each column, each row, and each of the nine 3×3 subgrids contains all of the 
            digits from 1 to 9.
          </p>
          <p>
            Despite the name meaning &quot;single number&quot; in Japanese, Sudoku is a game of logic, not mathematics. 
            No arithmetic is involved - only logical deduction!
          </p>
          <p>
            Each puzzle has a unique solution and can be solved without guessing. Improve your logical thinking 
            and problem-solving skills while having fun!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
