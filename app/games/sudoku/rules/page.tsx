import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Grid3x3, Lightbulb, Trophy } from "lucide-react"

export default function SudokuRulesPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Game Objective
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm sm:text-base text-muted-foreground">
          <p>
            Fill the 9×9 grid with digits 1-9 so that each column, each row, and each of the nine 3×3 sub-grids 
            contains all digits from 1 to 9 without repetition.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basic Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Each row must contain the digits 1-9 without repetition</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Each column must contain the digits 1-9 without repetition</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Each 3×3 box must contain the digits 1-9 without repetition</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Some cells are pre-filled and cannot be changed</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Use logic and deduction to fill in the empty cells</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3x3 className="h-5 w-5 text-primary" />
            How to Play
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">1.</span>
              <span><strong>Select a cell:</strong> Click on any empty cell to select it</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">2.</span>
              <span><strong>Enter a number:</strong> Click a number (1-9) to fill the selected cell</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">3.</span>
              <span><strong>Use notes:</strong> Click the pencil icon to toggle notes mode for marking possibilities</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">4.</span>
              <span><strong>Clear cell:</strong> Use the Clear button to remove a number from the selected cell</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">5.</span>
              <span><strong>Get hints:</strong> Click Hint button if you&apos;re stuck (increases hint counter)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">6.</span>
              <span><strong>Pause/Resume:</strong> Pause the game anytime to take a break</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Difficulty Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="bg-green-500/10 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-base">🌱 Easy</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>30 cells removed</p>
                <p className="text-muted-foreground">Perfect for beginners</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-500/10 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-base">⚡ Medium</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>40 cells removed</p>
                <p className="text-muted-foreground">Moderate challenge</p>
              </CardContent>
            </Card>

            <Card className="bg-orange-500/10 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-base">🔥 Hard</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>50 cells removed</p>
                <p className="text-muted-foreground">Requires advanced techniques</p>
              </CardContent>
            </Card>

            <Card className="bg-red-500/10 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-base">💀 Expert</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>55 cells removed</p>
                <p className="text-muted-foreground">For Sudoku masters!</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Tips & Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">💡</span>
              <span><strong>Start simple:</strong> Look for rows, columns, or boxes that are nearly complete</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">💡</span>
              <span><strong>Use notes:</strong> Mark possible numbers in cells to keep track of options</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">💡</span>
              <span><strong>Scan systematically:</strong> Check each number 1-9 across the entire grid</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">💡</span>
              <span><strong>Look for singles:</strong> Find cells where only one number can fit</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">💡</span>
              <span><strong>Use elimination:</strong> Cross out impossible numbers to narrow down choices</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">💡</span>
              <span><strong>Check your work:</strong> Red highlights indicate conflicts - fix them quickly!</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-muted/50 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Pro Tip
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Advanced technique: &quot;Naked pairs&quot; - If two cells in a row/column/box can only contain 
            the same two numbers, you can eliminate those numbers from other cells in that region!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
